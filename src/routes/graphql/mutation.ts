import { PrismaClient } from "@prisma/client";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { newPostInputType, newProfileInputType, newUserInputType, postType, profileType, userType } from "./types/types.js";



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
    })
  });