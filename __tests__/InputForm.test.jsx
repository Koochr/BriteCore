/* global it, jest, expect */
import React from "react"
import { shallow, configure, mount, } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import InputForm from "../react/components/InputForm.jsx"

configure({ adapter: new Adapter(), })

it("Should render correctly", () => {
	const component = shallow(
		<InputForm onSubmit={() => {}}/>
	)
	expect(component).toMatchSnapshot()
})

it("Should render needed elements", () => {
	const component = mount(
		<InputForm onSubmit={() => {}} onCancel={() => {}} submitButtonName="sbm-btn" cancelButtonName="cnc-btn" />
	)
	const form = component.find("form")
	expect(form).toHaveLength(1)
	const input = form.find("textarea")
	expect(input).toHaveLength(1)
	const buttonSubmit = component.find(".btn-success")
	expect(buttonSubmit).toHaveLength(1)
	expect(buttonSubmit.props().children).toStrictEqual("sbm-btn")
	const buttonCancel = component.find(".btn-danger")
	expect(buttonCancel).toHaveLength(1)
	expect(buttonCancel.props().children).toStrictEqual("cnc-btn")
})

it("Should handle input change and submit by button press", () => {
	const initialText = "some text"
	const component = mount(
		<InputForm onSubmit={jest.fn()} initialValue={initialText} />
	)
	const enteredText = " and some more text"
	const mockStopPropagation = jest.fn()
	expect(component.state().value).toStrictEqual(initialText)
	component.find("textarea").simulate("change", { target: { value: initialText + enteredText, }, })
	expect(component.state().value).toStrictEqual(initialText + enteredText)
	component.find("button").simulate("click", { stopPropagation: mockStopPropagation, })
	expect(component.props().onSubmit).toBeCalledWith(initialText + enteredText)
	expect(mockStopPropagation.mock.calls.length).toStrictEqual(1)
})

it("Should handle input change and submit by enter key press", () => {
	const initialText = "initial text"
	const component = mount(
		<InputForm onSubmit={jest.fn()} initialValue={initialText}/>
	)
	const enteredText = " and other text"
	const mockPreventDefault = jest.fn()
	const mockStopPropagation = jest.fn()
	expect(component.state().value).toStrictEqual(initialText)
	component.find("textarea").simulate("change", { target: { value: initialText + enteredText, }, })
	expect(component.state().value).toStrictEqual(initialText + enteredText)
	component.find("textarea").simulate("keyPress", {
		charCode: 13,
		preventDefault: mockPreventDefault,
		stopPropagation: mockStopPropagation,
	})
	expect(component.props().onSubmit).toBeCalledWith(initialText + enteredText)
	expect(mockPreventDefault.mock.calls.length).toStrictEqual(1)
	expect(mockStopPropagation.mock.calls.length).toStrictEqual(1)
})

it("Should handle cancel button press", () => {
	const component = mount(
		<InputForm onSubmit={jest.fn()} onCancel={jest.fn()} />
	)
	const mockStopPropagation = jest.fn()
	component.find(".btn-danger").simulate("click", { stopPropagation: mockStopPropagation, })
	expect(component.props().onCancel.mock.calls.length).toStrictEqual(1)
	expect(mockStopPropagation.mock.calls.length).toStrictEqual(1)

})
