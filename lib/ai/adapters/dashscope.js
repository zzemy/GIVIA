"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDashScopeCompletion = requestDashScopeCompletion;
function contentToString(content) {
    if (typeof content === 'string') {
        return content;
    }
    if (!Array.isArray(content)) {
        return '';
    }
    return content
        .map(function (part) { return (typeof (part === null || part === void 0 ? void 0 : part.text) === 'string' ? part.text : ''); })
        .join('\n')
        .trim();
}
function readProviderError(response) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, message, code;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, response.text()];
                case 1:
                    raw = _e.sent();
                    try {
                        parsed = JSON.parse(raw);
                        message = (_b = (_a = parsed.error) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.trim();
                        code = (_d = (_c = parsed.error) === null || _c === void 0 ? void 0 : _c.code) === null || _d === void 0 ? void 0 : _d.trim();
                        if (message && code) {
                            return [2 /*return*/, "".concat(code, ": ").concat(message)];
                        }
                        if (message) {
                            return [2 /*return*/, message];
                        }
                    }
                    catch (_f) {
                        if (raw.trim()) {
                            return [2 /*return*/, raw.slice(0, 500)];
                        }
                    }
                    return [2 /*return*/, "provider request failed with status ".concat(response.status)];
            }
        });
    });
}
function requestDashScopeCompletion(input) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, baseUrl, model, messages, temperature, maxTokens, responseFormat, networkErrorPrefix, providerErrorPrefix, response, error_1, providerError, payload, content;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    apiKey = input.apiKey, baseUrl = input.baseUrl, model = input.model, messages = input.messages, temperature = input.temperature, maxTokens = input.maxTokens, responseFormat = input.responseFormat, networkErrorPrefix = input.networkErrorPrefix, providerErrorPrefix = input.providerErrorPrefix;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/chat/completions"), {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(apiKey),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(__assign(__assign(__assign(__assign({ model: model }, (typeof temperature === 'number' ? { temperature: temperature } : {})), (typeof maxTokens === 'number' ? { max_tokens: maxTokens } : {})), { messages: messages }), (responseFormat ? { response_format: responseFormat } : {}))),
                        })];
                case 2:
                    response = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _d.sent();
                    return [2 /*return*/, {
                            ok: false,
                            error: error_1 instanceof Error && error_1.message
                                ? "".concat(networkErrorPrefix, ": ").concat(error_1.message)
                                : networkErrorPrefix,
                        }];
                case 4:
                    if (!!response.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, readProviderError(response)];
                case 5:
                    providerError = _d.sent();
                    return [2 /*return*/, {
                            ok: false,
                            error: "".concat(providerErrorPrefix, ": ").concat(providerError),
                        }];
                case 6: return [4 /*yield*/, response.json()];
                case 7:
                    payload = (_d.sent());
                    content = contentToString((_c = (_b = (_a = payload.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content);
                    if (!content.trim()) {
                        return [2 /*return*/, {
                                ok: false,
                                error: 'empty model output',
                            }];
                    }
                    return [2 /*return*/, {
                            ok: true,
                            content: content,
                        }];
            }
        });
    });
}
