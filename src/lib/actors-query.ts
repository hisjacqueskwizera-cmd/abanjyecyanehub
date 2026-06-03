import { queryOptions } from "@tanstack/react-query";
import { listActors, getActorBySlug } from "./actors.functions";

export const actorsQueryOptions = queryOptions({
  queryKey: ["actors"],
  queryFn: () => listActors(),
});

export const actorQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["actors", slug],
    queryFn: () => getActorBySlug({ data: { slug } }),
  });
