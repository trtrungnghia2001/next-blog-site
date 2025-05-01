export type ParamType = {
  pageSize?: number;
  page?: number;
  q?: string;
  sort?: string;
};

export type ListType<T = unknown> = {
  results: T[];
  paginate: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export type StoreType<T = unknown> = {
  data: T[];
  getAll: (params?: ParamType) => Promise<ListType<T>>;
  create: (data: T) => void;
  updateById: (id: string, data: T) => void;
  deleteById: (id: string) => void;
};
