from conftest import make_client, register

API = "/api/v1"

DESIGN = {
    "name": "Formal navy jacket",
    "garmentId": "jacket",
    "colorId": "navy",
    "styleId": "formal",
    "fitId": "regular",
    "customOptions": {},
    "selectedSize": "40R",
    "selectedSizeType": "numeric",
}
PROFILE = {
    "profileName": "My measurements",
    "unit": "cm",
    "values": {"height": 172.5, "neck": None, "chest": 96, "waist": 82},
    "fieldStatus": {"height": "user_entered", "neck": "not_recorded", "chest": "camera_estimate"},
    "fitPreference": "regular",
}


def test_design_crud_roundtrip(user_client):
    created = user_client.post(f"{API}/designs", json=DESIGN)
    assert created.status_code == 201, created.text
    d = created.json()["data"]
    assert {k: d[k] for k in DESIGN} == DESIGN

    listing = user_client.get(f"{API}/designs").json()
    assert listing["meta"]["total"] == 1 and listing["data"][0]["id"] == d["id"]

    patched = user_client.patch(f"{API}/designs/{d['id']}", json={"colorId": "black", "name": "Black jacket"})
    assert patched.status_code == 200 and patched.json()["data"]["colorId"] == "black"
    assert user_client.get(f"{API}/designs/{d['id']}").json()["data"]["name"] == "Black jacket"

    assert user_client.delete(f"{API}/designs/{d['id']}").status_code == 204
    assert user_client.get(f"{API}/designs/{d['id']}").status_code == 404


def test_design_rejects_unknown_options(user_client):
    bad = {**DESIGN, "colorId": "neon", "customOptions": {"neckline": "crew-neck", "lapel": "made-up"}}
    r = user_client.post(f"{API}/designs", json=bad)
    assert r.status_code == 422
    fields = r.json()["error"]["fieldErrors"]
    assert "colorId" in fields and "customOptions.lapel" in fields

    assert user_client.post(f"{API}/designs", json={**DESIGN, "selectedSize": "99Z"}).status_code == 422
    assert user_client.post(f"{API}/designs", json={**DESIGN, "userId": "someone"}).status_code == 422


def test_patch_revalidates_merged_design(user_client):
    d = user_client.post(f"{API}/designs", json={**DESIGN, "garmentId": "t-shirt", "selectedSize": None,
                                                 "selectedSizeType": None,
                                                 "customOptions": {"neckline": "v-neck"}}).json()["data"]
    # neckline isn't a trousers option, so switching garment alone must fail.
    r = user_client.patch(f"{API}/designs/{d['id']}", json={"garmentId": "trousers"})
    assert r.status_code == 422


def test_cross_user_isolation():
    a, b = make_client(), make_client()
    register(a, "a@example.com")
    register(b, "b@example.com")
    design = a.post(f"{API}/designs", json=DESIGN).json()["data"]
    profile = a.post(f"{API}/measurement-profiles", json=PROFILE).json()["data"]

    assert b.get(f"{API}/designs").json()["meta"]["total"] == 0
    assert b.get(f"{API}/measurement-profiles").json()["meta"]["total"] == 0
    for path in (f"/designs/{design['id']}", f"/measurement-profiles/{profile['id']}"):
        assert b.get(f"{API}{path}").status_code == 404
        change = {"name": "x"} if "designs" in path else {"profileName": "x"}
        assert b.patch(f"{API}{path}", json=change).status_code == 404
        assert b.delete(f"{API}{path}").status_code == 404
    # B can't link A's profile to their own design.
    r = b.post(f"{API}/designs", json={**DESIGN, "measurementProfileId": profile["id"]})
    assert r.status_code == 422 and "measurementProfileId" in r.json()["error"]["fieldErrors"]
    assert a.get(f"{API}/designs/{design['id']}").status_code == 200


def test_profile_preserves_nulls_and_merges_patches(user_client):
    p = user_client.post(f"{API}/measurement-profiles", json=PROFILE).json()["data"]
    assert p["values"]["neck"] is None and "hip" not in p["values"]

    r = user_client.patch(f"{API}/measurement-profiles/{p['id']}",
                          json={"values": {"hip": 98.5}, "fieldStatus": {"hip": "user_entered"}})
    v = r.json()["data"]["values"]
    assert v == {"height": 172.5, "neck": None, "chest": 96, "waist": 82, "hip": 98.5}

    cleared = user_client.patch(f"{API}/measurement-profiles/{p['id']}", json={"values": {"chest": None}})
    assert cleared.json()["data"]["values"]["chest"] is None


def test_profile_validation(user_client):
    cases = [
        {**PROFILE, "values": {"waist": 5}},                       # out of cm range
        {**PROFILE, "unit": "in", "values": {"height": 172.5}},   # cm value under inch rules
        {**PROFILE, "values": {"wingspan": 180}},                 # unknown key
        {**PROFILE, "fieldStatus": {"neck": "not_recorded"}, "values": {"neck": 40}},
        {**PROFILE, "unit": "mm"},
        {**PROFILE, "fitPreference": "baggy"},
    ]
    for body in cases:
        assert user_client.post(f"{API}/measurement-profiles", json=body).status_code == 422, body


def test_deleting_profile_detaches_designs(user_client):
    p = user_client.post(f"{API}/measurement-profiles", json=PROFILE).json()["data"]
    d = user_client.post(f"{API}/designs", json={**DESIGN, "measurementProfileId": p["id"]}).json()["data"]
    assert d["measurementProfileId"] == p["id"]
    assert user_client.delete(f"{API}/measurement-profiles/{p['id']}").status_code == 204
    assert user_client.get(f"{API}/designs/{d['id']}").json()["data"]["measurementProfileId"] is None


def test_pagination(user_client):
    for i in range(5):
        user_client.post(f"{API}/designs", json={**DESIGN, "name": f"D{i}"})
    page = user_client.get(f"{API}/designs?limit=2&offset=2").json()
    assert page["meta"] == {"total": 5, "limit": 2, "offset": 2} and len(page["data"]) == 2
    assert user_client.get(f"{API}/designs?limit=500").status_code == 422
