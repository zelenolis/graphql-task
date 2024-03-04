import { PrismaClient } from "@prisma/client";
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import {
    changePostInput,
    changeProfileInput,
    changeUserInput,
    newPostInputType,
    newProfileInputType,
    newUserInputType,
    postType,
    profileType,
    userType
} from "./types/types.js";
import { UUIDType } from "./types/uuid.js";



export const rootMutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({

        createUser: {
            type: userType,
            args: {
                dto: {
                    type: new GraphQLNonNull(newUserInputType)
                }
            },
            resolve: async (parent, {dto}, context: { prisma: PrismaClient }) => {
                return await context.prisma.user.create({ data: dto })
            }
          },

          createPost: {
            type: postType,
            args: {
                dto: {
                    type: new GraphQLNonNull(newPostInputType)
                }
            },
            resolve: async (parent, {dto}, context: { prisma: PrismaClient }) => {
                return await context.prisma.post.create({ data: dto })
            }
          },

          createProfile: {
            type: profileType,
            args: {
                dto: {
                    type: new GraphQLNonNull(newProfileInputType)
                }
            },
            resolve: async (parent, {dto}, context: { prisma: PrismaClient }) => { 
                return await context.prisma.profile.create({
                    data: dto
                })
            }
          },

          
          changeUser: {
            type: userType,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                },
                dto: {
                    type: new GraphQLNonNull(changeUserInput)
                }
            },
            resolve: async (parent, {id, dto}, context: { prisma: PrismaClient }) => {
                return await context.prisma.user.update({
                    where: { id: id },
                    data: {
                        name: dto.name
                    }
                })
            }
          },     

          changePost: {
            type: postType,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                },
                dto: {
                    type: new GraphQLNonNull(changePostInput)
                }
            },
            resolve: async (parent, {id, dto}, context: { prisma: PrismaClient }) => {
                return await context.prisma.post.update({
                    where: { id: id },
                    data: {
                        title: dto.title
                    }
                })
            }
          },
          
          changeProfile: {
            type: profileType,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                },
                dto: {
                    type: new GraphQLNonNull(changeProfileInput)
                }
            },
            resolve: async (parent, {id, dto}, context: { prisma: PrismaClient }) => {
                return await context.prisma.profile.update({
                    where: { id: id },
                    data: {
                        isMale: dto.isMale
                    }
                })
            }
          },

          deleteUser: {
            type: GraphQLBoolean,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, {id}, context: { prisma: PrismaClient }) => {
                await context.prisma.user.delete({
                    where: { id: id }
                })
                return null
            }
          },

          deletePost: {
            type: GraphQLBoolean,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, {id}, context: { prisma: PrismaClient }) => {
                await context.prisma.post.delete({
                    where: { id: id }
                })
                return null
            }
          },

          deleteProfile: {
            type: GraphQLBoolean,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, {id}, context: { prisma: PrismaClient }) => {
                await context.prisma.profile.delete({
                    where: { id: id }
                })
                return null
            }
          },

          subscribeTo: {
            type: userType,
            args: {
                userId: {
                    type: new GraphQLNonNull(UUIDType)
                },
                authorId: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, {userId, authorId}, context: { prisma: PrismaClient }) => {
                return await context.prisma.user.update({
                    where: { id: userId },
                    data: {
                        userSubscribedTo: {
                            create: {
                                authorId: authorId
                            }
                        }
                    }
                })
            }
          },

          unsubscribeFrom: {
            type: GraphQLBoolean,
            args: {
                userId: {
                    type: new GraphQLNonNull(UUIDType)
                },
                authorId: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, {userId, authorId}, context: { prisma: PrismaClient }) => {
                await context.prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            subscriberId: userId,
                            authorId: authorId
                        }
                    }
                })
                return true
            }
          },

    })
  });