import {
  createSeries,
  deleteSeriesById,
  getSeriesByMe,
  updateSeriesById,
} from "@/services/query";
import { SeriesType } from "@/types/series.type";
import { StoreType } from "@/types/type";
import { create } from "zustand";

export const useSeriesStore = create<StoreType<SeriesType>>()((set, get) => ({
  data: [],
  getAll: async (params) => {
    const resp = await getSeriesByMe(params);
    set({ data: resp.results });
    return resp;
  },
  create: async (data) => {
    const resp = (await createSeries(data)) as unknown as SeriesType;
    set({ data: [resp, ...get().data] });
  },
  updateById: async (id, data) => {
    const resp = (await updateSeriesById(id, data)) as unknown as SeriesType;
    set({
      data: get().data.map((item) =>
        item.id === id ? { ...item, ...resp } : item
      ),
    });
  },
  deleteById: async (id) => {
    const resp = (await deleteSeriesById(id)) as unknown as SeriesType;
    set({
      data: get().data.filter((item) => item.id !== resp.id),
    });
  },
}));
