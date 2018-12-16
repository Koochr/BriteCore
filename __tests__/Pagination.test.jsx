/* global it, jest, expect */
import React from "react"
import { shallow, configure, mount, } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import Pagination from "../react/components/Pagination.jsx"

configure({ adapter: new Adapter(), })

it("Should render correctly", () => {
	const component = shallow(
		<Pagination onChangePage={() => {}} currentPage={0} totalRows={200} rowsPerPage={15}/>
	)
	expect(component).toMatchSnapshot()
})

it("Should render needed elements", () => {
	const component = shallow(
		<Pagination onChangePage={() => {}} currentPage={2} totalRows={200} rowsPerPage={15}/>
	)
	const ul = component.find("ul")
	expect(ul).toHaveLength(1)
	const buttons = component.find(".page-link")
	expect(buttons).toHaveLength(2)
	const text = component.find(".pagination-text")
	expect(text).toHaveLength(1)
	expect(text.props().children).toStrictEqual(" Records 31 - 45 of 200 ")
})

it("Should handle change page", () => {
	const mockOnChangePage = jest.fn()
	const component = mount(
		<Pagination onChangePage={mockOnChangePage} currentPage={2} totalRows={200} rowsPerPage={15}/>
	)
	const buttons = component.find(".page-link")
	buttons.at(0).simulate("click")
	expect(mockOnChangePage).toBeCalledWith(1)
	buttons.at(1).simulate("click")
	expect(mockOnChangePage).toBeCalledWith(3)
})

