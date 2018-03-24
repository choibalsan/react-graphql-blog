const { getUserId } = require('../../utils')

const post = {
  async createDraft(parent, { title, text, isPublished = false }, ctx, info) {
    const userId = getUserId(ctx)
    const isAdminUser = await ctx.db.exists.User({
      id: userId,
      type: "Admin"
    });
    console.log(isAdminUser);
    if(!isAdminUser) {
      throw new Error('no such admin user');
    }
    // 
    return ctx.db.mutation.createPost(
      {
        data: {
          title,
          text,
          isPublished,
          author: {
            connect: { id: userId },
          },
        },
      },
      info
    )
  },

  async editPost(parent, {id, title, text, isPublished = false }, ctx, info) {
    const userId = getUserId(ctx)
    const isAdminUser = await ctx.db.exists.User({
      id: userId,
      type: "Admin"
    });
    console.log(isAdminUser);
    if(!isAdminUser) {
      throw new Error('no such admin user');
    }
    // 
    return ctx.db.mutation.updatePost(
      {
        data: {
          title,
          text,
          isPublished,
          author: {
            connect: { id: userId },
          },
        },
        where:{
          id: id,
        }
      },
      info
    )
  },

  async publish(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.updatePost(
      {
        where: { id },
        data: { isPublished: true },
      },
      info,
    )
  },

  async deletePost(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.deletePost({ where: { id } })
  },
}

module.exports = { post }
