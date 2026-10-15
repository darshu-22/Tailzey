from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class StrictCamelModel(CamelModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="forbid")


class Envelope(CamelModel, Generic[T]):
    data: T


class PageMeta(CamelModel):
    total: int
    limit: int
    offset: int


class Page(CamelModel, Generic[T]):
    data: list[T]
    meta: PageMeta
