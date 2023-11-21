"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopic = exports.updateTopicName = exports.getAuthorsTopics = exports.createTopic = void 0;
const models_1 = require("../models");
const response_types_1 = require("../types/response.types");
const topicByAuthorAlreadyExists = (authorId, topicName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield models_1.Topic.find({ author: authorId, name: topicName });
        const topicsList = [].concat(topics);
        if (!topicsList.length)
            return false;
        return true;
    }
    catch (error) {
        console.error('Error: could not fetch topic:', error.message);
        return null;
    }
});
const getTopicById = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield models_1.Topic.findById(topicId);
        if (!topic) {
            console.error('topic does not exist');
            return null;
        }
        return topic;
    }
    catch (error) {
        console.error('Error: could not fetch topic:', error.message);
        return null;
    }
});
const getTopicsByAuthorId = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield models_1.Topic.find({ author: authorId });
        const topicsList = [].concat(topics);
        return topicsList;
    }
    catch (error) {
        console.error('Error: could not fetch topic:', error.message);
        return null;
    }
});
const createTopic = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', topic: {} };
    try {
        const author = response.locals.userId;
        if (!author) {
            responseObject.message = 'session expired';
            throw new Error(responseObject.message);
        }
        const allTopicsByAuthor = yield getTopicsByAuthorId(author);
        if (!allTopicsByAuthor) {
            responseObject.message = `failed to fetch all topics by author`;
            throw new Error(responseObject.message);
        }
        let highestTopicNumber = 0;
        allTopicsByAuthor.forEach((topic) => {
            if (!topic.name.includes('Topic'))
                return;
            const topicNumber = parseInt(topic.name.split(' ')[1]);
            if (isNaN(topicNumber))
                return;
            highestTopicNumber = Math.max(highestTopicNumber, topicNumber);
        });
        const name = `Topic ${highestTopicNumber + 1}`;
        const topicAlreadyExists = yield topicByAuthorAlreadyExists(author, name);
        switch (topicAlreadyExists) {
            case null: {
                responseObject.message = 'failed to fetch topics';
                throw new Error(responseObject.message);
            }
            case true: {
                responseObject.message = 'topic already exists';
                throw new Error(responseObject.message);
            }
        }
        const newTopic = new models_1.Topic({
            author,
            name
        });
        yield newTopic.save();
        responseObject.message = 'topic created successfully';
        responseObject.topic = {
            id: newTopic._id,
            name,
            pages: newTopic.pages
        };
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.createTopic = createTopic;
const getAuthorsTopics = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '', topics: [] };
    try {
        const author = response.locals.userId;
        if (!author) {
            responseObject.message = 'session expired';
            throw new Error(responseObject.message);
        }
        const allTopicsByAuthor = yield getTopicsByAuthorId(author);
        if (!allTopicsByAuthor) {
            responseObject.message = `failed to fetch all topics by author`;
            throw new Error(responseObject.message);
        }
        responseObject.message = `all author's topics fetched`;
        allTopicsByAuthor.forEach((topic) => {
            responseObject.topics.push({
                id: topic._id,
                pages: topic.pages,
                name: topic.name
            });
        });
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.getAuthorsTopics = getAuthorsTopics;
const updateTopicName = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '' };
    try {
        const { id, name } = request.body;
        if (!id || !name) {
            responseObject.message = `empty or missing request body parameters: received { id: ${id}, name: ${name} }`;
            throw new Error(responseObject.message);
        }
        const author = response.locals.userId;
        if (!author) {
            responseObject.message = 'session expired';
            throw new Error(responseObject.message);
        }
        const topicAlreadyExists = yield topicByAuthorAlreadyExists(author, name);
        switch (topicAlreadyExists) {
            case null: {
                responseObject.message = 'failed to fetch topics';
                throw new Error(responseObject.message);
            }
            case true: {
                responseObject.message = 'topic already exists';
                throw new Error(responseObject.message);
            }
        }
        const topic = yield getTopicById(id);
        if (!topic) {
            responseObject.message = 'topic not found';
            throw new Error(responseObject.message);
        }
        topic.name = name;
        yield topic.save();
        responseObject.message = 'topic name updated';
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.updateTopicName = updateTopicName;
const deleteTopic = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { message: '' };
    try {
        const { id } = request.body;
        if (!id) {
            responseObject.message = `empty or missing request body parameters: received { id: ${id} }`;
            throw new Error(responseObject.message);
        }
        const { deletedCount } = yield models_1.Topic.deleteOne({ _id: id });
        if (!deletedCount) {
            responseObject.message = `topic not found`;
            throw new Error(responseObject.message);
        }
        responseObject.message = 'topic deleted';
        response.status(response_types_1.ResponseStatusEnum.success).send(responseObject);
    }
    catch (error) {
        console.error('Error: ', error.message);
        if (!responseObject.message.length)
            responseObject.message = error.message;
        response.status(response_types_1.ResponseStatusEnum.error).send(responseObject);
    }
});
exports.deleteTopic = deleteTopic;
//# sourceMappingURL=topic.controller.js.map