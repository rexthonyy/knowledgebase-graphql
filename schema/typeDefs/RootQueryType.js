const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = require("graphql");

// data types
const KnowledgeBaseType = require("./KnowledgeBaseType");
const KnowledgeBaseTranslationType = require("./KnowledgeBaseTranslationType");
const KnowledgeBaseTranslationStatusColorType = require("./KnowledgeBaseTranslationStatusColorType");
const StatusMessageForKnowledgeBaseCategoryScheduleType = require("./StatusMessageForKnowledgeBaseCategoryScheduleType");
const KnowledgeBaseCategoryHybridStatType = require("./KnowledgeBaseCategoryHybridStatType");

// resolvers
const getAllKnowledgeBaseResolver = require("../resolvers/getAllKnowledgeBaseResolver");
const getKnowledgeBaseByIdResolver = require("../resolvers/getKnowledgeBaseByIdResolver");
const getAllKnowledgeBaseTranslationsForKnowledgeBaseResolver = require("../resolvers/getAllKnowledgeBaseTranslationsForKnowledgeBaseResolver");
const getAllKnowledgeBaseTranslationStatusColorResolver = require("../resolvers/getAllKnowledgeBaseTranslationStatusColorResolver");
const getScheduleForKnowledgebaseCategoryTranslationResolver = require("../resolvers/getScheduleForKnowledgebaseCategoryTranslationResolver");
const getKnowledgeBaseCategoriesResolver = require("../resolvers/getKnowledgeBaseCategoriesResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        knowledgebases: {
            type: GraphQLList(KnowledgeBaseType),
            description: "Get all knowledgebases",
            resolve: getAllKnowledgeBaseResolver
        },
        knowledgebase: {
            type: KnowledgeBaseType,
            description: "Get a single knowledgebase by id",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getKnowledgeBaseByIdResolver
        },
        knowledgebaseTranslations: {
            type: GraphQLList(KnowledgeBaseTranslationType),
            description: "Get all knowledgebase translations for a given knowledge base",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getAllKnowledgeBaseTranslationsForKnowledgeBaseResolver
        },
        knowledgebaseTranslationStatusColor: {
            type: GraphQLList(KnowledgeBaseTranslationStatusColorType),
            description: "Get the status color for the knowledgebase translations at the category specified",
            args: {
                filter_by: { type: GraphQLNonNull(GraphQLString) },
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) },
                category_id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve: getAllKnowledgeBaseTranslationStatusColorResolver
        },
        getScheduleForKnowledgebaseCategoryTranslation: {
            type: StatusMessageForKnowledgeBaseCategoryScheduleType,
            description: "Get a knowledgebase translation that is scheduled for publication, deletion or update",
            args: {
                knowledge_base_category_translation_id: { type: GraphQLNonNull(GraphQLID) },
                operation: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: getScheduleForKnowledgebaseCategoryTranslationResolver
        },
        getKnowledgebaseCategories: {
            type: GraphQLList(KnowledgeBaseCategoryHybridStatType),
            description: "Get all knowledgebase category translations in a knowledge base for a specified locale and level",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) },
                kb_locale_id: { type: GraphQLNonNull(GraphQLID) },
                level: { type: GraphQLInt },
                parent_id: { type: GraphQLID }
            },
            resolve: getKnowledgeBaseCategoriesResolver
        },
    })
});
