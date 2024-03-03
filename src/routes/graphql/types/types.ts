import { PrismaClient } from "@prisma/client";
import { UUIDType } from "./uuid.js";
import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from "graphql";



export const newMemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        basic: {
            value: 'basic',
        },
        business: {
            value: 'business',
        }
    }
});

export const newMemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(newMemberTypeId)
        },
        discount: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        postsLimitPerMonth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
    })
});


export const profileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(UUIDType)
        },
        isMale: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        yearOfBirth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        userId: {
            type: new GraphQLNonNull(UUIDType)
        },
        memberTypeId: {
            type: new GraphQLNonNull(newMemberTypeId)
        },
        memberType: {
            type: newMemberType,
            resolve: async (parent: { memberTypeId: string }, args, context: { prisma: PrismaClient }) => {
                return await context.prisma.memberType.findUnique({
                    where: {
                        id: parent.memberTypeId,
                    },
                });
            }
        },
    }),
});

export const newProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
        isMale: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        yearOfBirth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        userId: {
            type: new GraphQLNonNull(UUIDType)
        },
        memberTypeId: {
            type: new GraphQLNonNull(newMemberTypeId)
        }
    })
});

export const postType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(UUIDType)
        },
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        content: {
            type: new GraphQLNonNull(GraphQLString)
        },
        authorId: {
            type: new GraphQLNonNull(UUIDType)
        },
    })
})

export const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: UUIDType
        },
        name: {
            type: GraphQLString
        },
        balance: {
            type: GraphQLFloat
        },
        profile: {
            type: profileType,
            resolve: async (parent: {id: string}, args, context: { prisma: PrismaClient }) => {
                await context.prisma.profile.findUnique({
                    where: {
                        userId: parent.id
                    }
                })
            }
        },
        posts: {
            type: new GraphQLList(postType),
            resolve: async (parent: {id: string}, args, context: { prisma: PrismaClient }) => {
                await context.prisma.post.findMany({
                    where: {
                        authorId: parent.id
                    }
                })
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(userType),
            resolve: async (parent: {id: string}, args, context: { prisma: PrismaClient }) => {
                return await context.prisma.user.findMany({
                    where: {
                        subscribedToUser: {
                            some: {
                                subscriberId: parent.id,
                            }
                        }
                    }
                })
            }
        },
        subscribedToUser: {
            type: new GraphQLList(userType),
            resolve: async (parent: {id: string}, args, context: { prisma: PrismaClient }) => {
                return await context.prisma.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                                subscriberId: parent.id,
                            }
                        }
                    }
                })
            }
        }
    })
});

export const newUserInputType = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        balance: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
});

export const newPostInputType = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: () => ({
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        content: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        authorId: {
            type: new GraphQLNonNull(UUIDType)
        }
    })
});
