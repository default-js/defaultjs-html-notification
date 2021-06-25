const ObjectUtils = defaultjs.common.utils.ObjectUtils;
const uuid = defaultjs.common.utils.UUID.uuid;
const PrivateProperty = defaultjs.common.utils.PrivateProperty;
const { ExpressionResolver } = defaultjs.el;
const { Renderer, Template } = defaultjs.jstl;
const Component = defaultjs.html.components.Component;
const defineComponent = defaultjs.html.components.utils.DefineComponentHelper;
const { defValue } = ObjectUtils;
const privateProperty = PrivateProperty.privateProperty;

export {
	ExpressionResolver,
	Renderer,
	Template,
	Component,
	defineComponent,
	defValue,
	privateProperty,
	uuid
};