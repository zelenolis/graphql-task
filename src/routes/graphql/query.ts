import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { newMemberType, newMemberTypeId, postType, profileType, userType } from './types/types.js'
import { PrismaClient } from '@prisma/client';
import { UUIDType } from "./types/uuid.js";

export const rootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({

        memberTypes: {
            type: new GraphQLList(newMemberType),
            resolve: async (parent, args, context: { prisma: PrismaClient }) => {
                return await context.prisma.memberType.findMany()},
        },

        memberType: {
            type: newMemberType,
            args: {
                id: {
                    type: new GraphQLNonNull(newMemberTypeId)
                }
            },
            resolve: async (parent, {id}, context: { prisma: PrismaClient }) => {
                return await context.prisma.memberType.findUnique({
                    where: { id },
                })
            }
        },

        users: {
            type: new GraphQLList(userType),
            resolve: async (parent, args, context: { prisma: PrismaClient }) => {
                return await context.prisma.user.findMany();
            }
        },

        user: {
            type: userType,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, args: {id: string}, context: { prisma: PrismaClient }) => {
                return await context.prisma.user.findUnique({
                    where: {
                        id: args.id
                    }
                });
            }
        },

        posts: {
            type: new GraphQLList(postType),
            resolve: async (parent, args, context: { prisma: PrismaClient }) => {
                return await context.prisma.post.findMany();
            }
        },

        post: {
            type: postType,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, args: {id: string}, context: { prisma: PrismaClient }) => {
                return await context.prisma.post.findUnique({
                    where: {
                        id: args.id
                    }
                });
            }
        },

        profiles: {
            type: new GraphQLList(profileType),
            resolve: async (parent, args, context: { prisma: PrismaClient }) => {
                return await context.prisma.profile.findMany();
            }
        },

        profile: {
            type: profileType,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (parent, args: {id: string}, context: { prisma: PrismaClient }) => {
                return await context.prisma.profile.findUnique({
                    where: {
                        id: args.id
                    }
                });
            }
        }

    })
  });