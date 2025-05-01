"use server";
import { prisma } from "@/lib/prisma";
import { PostType } from "@/types/post.type";
import { auth } from "@clerk/nextjs/server";
import { ParamType } from "@/types/type";
import { UserType } from "@/types/user.type";
import { SeriesType } from "@/types/series.type";
import { BookmarkType } from "@/types/bookmark.type";

const QUERY_PARAM: ParamType = {
  pageSize: 10,
  page: 1,
  q: "",
  sort: "createdAt",
};

// ===================== PUBLIC =========================
export async function getUserId(id: string) {
  const resp = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  return resp;
}
// post
export async function getPostId(id: string) {
  const resp = await prisma.post.findFirst({
    include: {
      author: true,
      bookmarks: true,
    },
    where: {
      id,
      published: true,
    },
  });

  return resp;
}
export async function getAllPost(params?: ParamType) {
  const page = Number(params?.page) || (QUERY_PARAM.page as number);
  const pageSize = Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);
  const q = params?.q || QUERY_PARAM.q;
  const sort = params?.sort || QUERY_PARAM.sort;

  const resp = await prisma.post.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: {
      [sort as string]: "desc",
    },
    include: {
      author: true,
    },
    where: {
      title: {
        contains: q,
        mode: "insensitive",
      },
      published: true,
    },
  });
  const totalCount = await prisma.post.count({
    where: {
      title: {
        contains: q,
        mode: "insensitive",
      },
      published: true,
    },
  });
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    results: resp as unknown as PostType[],
    paginate: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}
export async function getPostByCategoryId(id: string, params?: ParamType) {
  const page = Number(params?.page) || (QUERY_PARAM.page as number);
  const pageSize = Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);

  const filter = {
    category: id,
    published: true,
  };

  const resp = await prisma.post.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      author: true,
    },
    where: filter,
  });
  const totalCount = await prisma.post.count({
    where: filter,
  });
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    results: resp as unknown as PostType[],
    paginate: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}
export async function getPostByAuthorId(id: string, params?: ParamType) {
  const page = Number(params?.page) || (QUERY_PARAM.page as number);
  const pageSize = Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);

  const filter = {
    authorId: id,
    published: true,
  };

  const resp = await prisma.post.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      author: true,
    },
    where: filter,
  });
  const totalCount = await prisma.post.count({
    where: filter,
  });
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    results: resp as unknown as PostType[],
    paginate: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}

// series
export async function getSeriesId(id: string) {
  const resp = await prisma.series.findFirst({
    include: {
      author: true,
    },
    where: {
      id,
    },
  });

  return resp;
}
export async function getAllSeries(params?: ParamType) {
  const page = Number(params?.page) || (QUERY_PARAM.page as number);
  const pageSize = Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);
  const q = params?.q || QUERY_PARAM.q;
  const sort = params?.sort || QUERY_PARAM.sort;

  const resp = await prisma.series.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: {
      [sort as string]: "desc",
    },
    include: {
      author: true,
    },
    where: {
      title: {
        contains: q,
        mode: "insensitive",
      },
    },
  });
  const totalCount = await prisma.series.count({
    where: {
      title: {
        contains: q,
        mode: "insensitive",
      },
    },
  });
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    results: resp as unknown as PostType[],
    paginate: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}
export async function getPostBySeriesId(id: string, params?: ParamType) {
  const page = Number(params?.page) || (QUERY_PARAM.page as number);
  const pageSize = Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);

  const resp = await prisma.postOfSeries.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      post: {
        include: {
          author: true,
        },
      },
    },
    where: {
      seriesId: id,
    },
  });
  const totalCount = await prisma.postOfSeries.count({
    where: {
      seriesId: id,
    },
  });
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    results: resp.map((item) => item.post) as unknown as PostType[],
    paginate: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}

// ===================== AUTH =========================
export async function checkAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User is not authenticated!");
  }
  let user = await prisma.user.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        userId: userId,
        name: "user",
      },
    });
  }

  return user;
}
// dashboard

// post
export async function getPostByMe(params?: ParamType) {
  try {
    const user = await checkAuth();

    const page = Number(params?.page) || (QUERY_PARAM.page as number);
    const q = params?.q || QUERY_PARAM.q;
    const pageSize =
      Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);

    const resp = await prisma.post.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        author: true,
      },
      where: {
        authorId: user.id,
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalCount = await prisma.post.count({
      where: {
        authorId: user.id,
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      results: resp as unknown as PostType[],
      paginate: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function increasePost(postId: string) {
  try {
    await checkAuth();

    const resp = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        total_views: {
          increment: 1,
        },
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function createPost(body: PostType) {
  try {
    const user = await checkAuth();

    const resp = await prisma.post.create({
      data: { ...body, authorId: user?.id, author: undefined },
      include: {
        author: true,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function updatePostById(id: string, body: PostType) {
  try {
    await checkAuth();

    const resp = await prisma.post.update({
      data: {
        ...body,
        author: undefined,
      },
      include: {
        author: true,
      },
      where: {
        id: id,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function deletePostById(id: string) {
  try {
    await checkAuth();

    await prisma.bookmark.deleteMany({
      where: {
        postId: id,
      },
    });

    const resp = await prisma.post.delete({
      include: {
        author: true,
      },
      where: {
        id: id,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function getPostByDashboard() {
  try {
    const user = await checkAuth();

    const getBlog = await prisma.post.groupBy({
      by: ["category"],
      _sum: {
        total_views: true,
      },
      where: {
        authorId: user.id,
      },
    });
    return getBlog;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
// series
export async function getSeriesByMe(params?: ParamType) {
  try {
    const user = await checkAuth();

    const page = Number(params?.page) || (QUERY_PARAM.page as number);
    const q = params?.q || QUERY_PARAM.q;
    const pageSize =
      Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);

    const resp = await prisma.series.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        author: true,
        postsOfSeries: true,
      },
      where: {
        authorId: user.id,
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalCount = await prisma.series.count({
      where: {
        authorId: user.id,
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      results: resp as unknown as SeriesType[],
      paginate: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function increaseSeries(seriesId: string) {
  try {
    await checkAuth();

    const resp = await prisma.series.update({
      where: {
        id: seriesId,
      },
      data: {
        total_views: {
          increment: 1,
        },
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function createSeries(body: SeriesType) {
  try {
    const user = await checkAuth();

    const resp = await prisma.series.create({
      data: {
        ...body,
        authorId: user?.id,
        author: undefined,
        postsOfSeries: undefined,
      },
      include: {
        author: true,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function updateSeriesById(id: string, body: SeriesType) {
  try {
    await checkAuth();

    const resp = await prisma.series.update({
      data: { ...body, author: undefined, postsOfSeries: undefined },
      include: {
        author: true,
      },
      where: {
        id: id,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function deleteSeriesById(id: string) {
  try {
    await checkAuth();

    await prisma.postOfSeries.deleteMany({
      where: {
        seriesId: id,
      },
    });

    const resp = await prisma.series.delete({
      include: {
        author: true,
      },
      where: {
        id: id,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function switchBlogToSeries(seriesId: string, postId: string) {
  try {
    await checkAuth();

    const check = await prisma.postOfSeries.findFirst({
      where: {
        seriesId: seriesId,
        postId: postId,
      },
    });

    let resp;
    if (!check) {
      resp = await prisma.postOfSeries.create({
        data: {
          seriesId: seriesId,
          postId: postId,
        },
      });
    } else {
      resp = await prisma.postOfSeries.deleteMany({
        where: {
          seriesId: seriesId,
          postId: postId,
        },
      });
    }

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}

// bookmark
export async function switchBookmark(postId: string) {
  try {
    const user = await checkAuth();
    const check = await prisma.bookmark.findFirst({
      where: {
        authorId: user.id,
        postId: postId,
      },
    });

    let resp;
    if (!check) {
      resp = await prisma.bookmark.create({
        data: {
          authorId: user.id,
          postId: postId,
        },
        include: {
          author: true,
          post: true,
        },
      });
    } else {
      resp = await prisma.bookmark.deleteMany({
        where: {
          authorId: user.id,
          postId: postId,
        },
      });
    }

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function getBookmarkByMe(params?: ParamType) {
  try {
    const user = await checkAuth();

    const page = Number(params?.page) || (QUERY_PARAM.page as number);
    const pageSize =
      Number(params?.pageSize) || (QUERY_PARAM.pageSize as number);

    const resp = await prisma.bookmark.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        post: {
          include: {
            author: true,
          },
        },
      },
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalCount = await prisma.bookmark.count({
      where: {
        authorId: user.id,
      },
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      results: resp as unknown as BookmarkType[],
      paginate: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
// me
export async function updateMe(body: UserType) {
  try {
    const user = await checkAuth();

    const resp = await prisma.user.update({
      data: { ...body },
      where: {
        id: user.id,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function getMe() {
  try {
    const user = await checkAuth();

    const resp = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
export async function changePassword(password: string) {
  try {
    const user = await checkAuth();

    const resp = await prisma.user.update({
      data: { password: password },
      where: {
        id: user.id,
      },
    });

    return resp;
  } catch (error) {
    throw new Error((error as Error)?.message || "An unknown error occurred");
  }
}
