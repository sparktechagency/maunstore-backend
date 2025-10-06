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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const faq_model_1 = require("./faq.model");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const createFaqToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const faq = yield faq_model_1.Faq.create(payload);
    if (!faq) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to created Faq');
    }
    return faq;
});
const getFaqsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const faqs = yield faq_model_1.Faq.find();
    if (!faqs || faqs.length === 0) {
        throw new AppError_1.default(404, 'No faqs found in the database');
    }
    return faqs;
});
const updateFaqToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    const updatedFaq = yield faq_model_1.Faq.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
    });
    if (!updatedFaq) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to updated Faq');
    }
    return updatedFaq;
});
const deleteFaqToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_model_1.Faq.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete faqs');
    }
    return result;
});
const deleteMultipleFaqsFromDB = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ids);
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No IDs provided for deletion');
    }
    const result = yield faq_model_1.Faq.deleteMany({ _id: { $in: ids } });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to delete FAQs');
    }
    return result;
});
exports.FaqServices = {
    createFaqToDB,
    updateFaqToDB,
    getFaqsFromDB,
    deleteFaqToDB,
    deleteMultipleFaqsFromDB,
};
