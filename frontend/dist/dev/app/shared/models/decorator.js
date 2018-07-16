"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../helpers/reflect");
var ModelRegister = (function () {
    function ModelRegister() {
        this.registry = {};
    }
    Object.defineProperty(ModelRegister, "Instance", {
        get: function () {
            return this._instance || (this._instance = new ModelRegister());
        },
        enumerable: true,
        configurable: true
    });
    ModelRegister.prototype.register = function (model, ctor) {
        this.registry[model] = ctor;
    };
    ModelRegister.prototype.lookup = function (model) {
        return this.registry[model];
    };
    ModelRegister.prototype.instantiateObject = function (model) {
        var ctor = this.registry[model];
        return ctor ? new ctor() : null;
    };
    return ModelRegister;
}());
exports.ModelRegister = ModelRegister;
exports.MODEL_METADATA_KEY = Symbol("model");
function Model(model) {
    return function (ctor) {
        ModelRegister.Instance.register(model, ctor);
        Reflect.defineMetadata(exports.MODEL_METADATA_KEY, model, ctor);
    };
}
exports.Model = Model;
exports.FIELD_METADATA_KEY = "fieldProperty";
function FieldProperty(metadata) {
    if (metadata instanceof String || typeof metadata === "string") {
        return Reflect.metadata(exports.FIELD_METADATA_KEY, {
            name: metadata,
            clazz: undefined
        });
    }
    else {
        var metadataObj = metadata;
        return Reflect.metadata(exports.FIELD_METADATA_KEY, {
            name: metadataObj ? metadataObj.name : undefined,
            clazz: metadataObj ? metadataObj.clazz : undefined
        });
    }
}
exports.FieldProperty = FieldProperty;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvbW9kZWxzL2RlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhCQUE0QjtBQUc1QjtJQUtJO1FBRUksSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELHNCQUFrQix5QkFBUTthQUExQjtZQUdJLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7OztPQUFBO0lBRU0sZ0NBQVEsR0FBZixVQUFnQixLQUFLLEVBQUUsSUFBSTtRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUksOEJBQU0sR0FBYixVQUFjLEtBQUs7UUFDZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVLLHlDQUFpQixHQUF4QixVQUF5QixLQUFLO1FBQzNCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBQ1Asb0JBQUM7QUFBRCxDQTVCQSxBQTRCQyxJQUFBO0FBNUJZLHNDQUFhO0FBZ0NiLFFBQUEsa0JBQWtCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRWxELGVBQXVCLEtBQWE7SUFDaEMsT0FBTyxVQUFDLElBQWM7UUFDbEIsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxjQUFjLENBQUMsMEJBQWtCLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQTtBQUNMLENBQUM7QUFMRCxzQkFLQztBQVNZLFFBQUEsa0JBQWtCLEdBQUcsZUFBZSxDQUFDO0FBRWxELHVCQUFpQyxRQUFrQztJQUMvRCxJQUFJLFFBQVEsWUFBWSxNQUFNLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFDO1FBQzNELE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQywwQkFBa0IsRUFBRTtZQUN4QyxJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssRUFBRSxTQUFTO1NBQ25CLENBQUMsQ0FBQztLQUNOO1NBQU07UUFDSCxJQUFJLFdBQVcsR0FBc0IsUUFBUSxDQUFDO1FBQzlDLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQywwQkFBa0IsRUFBRTtZQUN4QyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2hELEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDckQsQ0FBQyxDQUFDO0tBQ047QUFDTCxDQUFDO0FBYkQsc0NBYUMiLCJmaWxlIjoiYXBwL3NoYXJlZC9tb2RlbHMvZGVjb3JhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9oZWxwZXJzL3JlZmxlY3QnO1xuaW1wb3J0IHsgQmFzZU1vZGVsIH0gZnJvbSAnLi9iYXNlLm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIE1vZGVsUmVnaXN0ZXJcbntcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IE1vZGVsUmVnaXN0ZXI7XG4gICAgcHJpdmF0ZSByZWdpc3RyeTogYW55O1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5ID0ge307XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgSW5zdGFuY2UoKVxuICAgIHtcbiAgICAgICAgLy8gRG8geW91IG5lZWQgYXJndW1lbnRzPyBNYWtlIGl0IGEgcmVndWxhciBtZXRob2QgaW5zdGVhZC5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlIHx8ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBNb2RlbFJlZ2lzdGVyKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlcihtb2RlbCwgY3Rvcikge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5W21vZGVsXSA9IGN0b3I7XG4gICAgICB9XG5cbiAgICBwdWJsaWMgbG9va3VwKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5W21vZGVsXTtcbiAgICAgIH1cblxuICAgICBwdWJsaWMgaW5zdGFudGlhdGVPYmplY3QobW9kZWwpOmFueSB7XG4gICAgICAgIHZhciBjdG9yID0gdGhpcy5yZWdpc3RyeVttb2RlbF07XG4gICAgICAgIHJldHVybiBjdG9yID8gbmV3IGN0b3IoKSA6IG51bGw7XG4gICAgICB9XG59XG5cblxuLyogTW9kZWwgZGVjb3JhdG9yICovXG5leHBvcnQgY29uc3QgTU9ERUxfTUVUQURBVEFfS0VZID0gU3ltYm9sKFwibW9kZWxcIik7XG5cbmV4cG9ydCBmdW5jdGlvbiBNb2RlbCggbW9kZWw6IHN0cmluZykge1xuICAgIHJldHVybiAoY3RvcjogRnVuY3Rpb24pID0+IHtcbiAgICAgICAgTW9kZWxSZWdpc3Rlci5JbnN0YW5jZS5yZWdpc3Rlcihtb2RlbCxjdG9yKTtcbiAgICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShNT0RFTF9NRVRBREFUQV9LRVksIG1vZGVsLCBjdG9yKTtcbiAgICB9XG59XG5cblxuLyogRmllbGQgZGVjb3JhdG9yICovXG5leHBvcnQgaW50ZXJmYWNlIElGaWVsZE1ldGFEYXRhPFQ+IHtcbiAgICBuYW1lPzogc3RyaW5nLFxuICAgIGNsYXp6Pzoge25ldygpOiBUfVxufVxuXG5leHBvcnQgY29uc3QgRklFTERfTUVUQURBVEFfS0VZID0gXCJmaWVsZFByb3BlcnR5XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBGaWVsZFByb3BlcnR5PFQ+KG1ldGFkYXRhPzpJRmllbGRNZXRhRGF0YTxUPnxzdHJpbmcpOiBhbnkge1xuICAgIGlmIChtZXRhZGF0YSBpbnN0YW5jZW9mIFN0cmluZyB8fCB0eXBlb2YgbWV0YWRhdGEgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShGSUVMRF9NRVRBREFUQV9LRVksIHtcbiAgICAgICAgICAgIG5hbWU6IG1ldGFkYXRhLFxuICAgICAgICAgICAgY2xheno6IHVuZGVmaW5lZFxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbWV0YWRhdGFPYmogPSA8SUZpZWxkTWV0YURhdGE8VD4+bWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKEZJRUxEX01FVEFEQVRBX0tFWSwge1xuICAgICAgICAgICAgbmFtZTogbWV0YWRhdGFPYmogPyBtZXRhZGF0YU9iai5uYW1lIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY2xheno6IG1ldGFkYXRhT2JqID8gbWV0YWRhdGFPYmouY2xhenogOiB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbiJdfQ==