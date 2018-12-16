/* global it, jest, expect */
import React from "react"
import { shallow, configure, } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import DataTable from "../react/components/DataTable.jsx"

configure({ adapter: new Adapter(), })

const mockColumns = ["id", "name", "description",]
const mockData = [
	{
		id: 1,
		name: "John",
		description: "Is a nice guy",
	},

	{
		id: 44,
		name: "Jack",
		description: "Is a nice guy too",
	},
	{
		id: 77,
		name: "Unknown",
		description: "Suspicious person",
	},
	{
		id: 47,
		name: "Ivan",
		description: "Nothing to say about",
	},
]

it("Should render correctly", () => {
	const component = shallow(
		<DataTable data={mockData} columns={mockColumns} onHeaderClick={jest.fn()} onFocusChange={jest.fn()} />
	)
	expect(component).toMatchSnapshot()
})

it("Should render needed components", () => {
	const component = shallow(
		<DataTable data={mockData} columns={mockColumns} onHeaderClick={jest.fn()} onFocusChange={jest.fn()} />
	)
	const table = component.find("table")
	expect(table).toHaveLength(1)
	const ths = table.find("th")
	expect(ths).toHaveLength(3)
	for (let i=0; i<ths.length; i++) {
		expect(ths.at(i).props().children[0]).toStrictEqual(mockColumns[i])
	}
	const trs = table.find("tr")
	expect(trs).toHaveLength(5)
	for (let i=1; i<trs.length; i++) {
		const tds = trs.at(i).find("td")
		expect(tds).toHaveLength(3)
		for (let j=0; j<tds.length; j++) {
			expect(tds.at(j).props().children).toStrictEqual(mockData[i-1][mockColumns[j]])
		}
	}
})

it("Should handle header clicks", () => {
	const mockHeaderClickHandler = jest.fn()
	const component = shallow(
		<DataTable
			data={mockData}
			columns={mockColumns}
			onHeaderClick={mockHeaderClickHandler}
			onFocusChange={jest.fn()}
		/>
	)
	const ths = component.find("th")
	for (let i=0; i<ths.length; i++) {
		ths.at(i).simulate("click")
		expect(mockHeaderClickHandler).toBeCalledWith(mockColumns[i])
	}
})

it("Should handle focus change", () => {
	const mockFocusHandler = jest.fn()
	const component = shallow(
		<DataTable
			data={mockData}
			columns={mockColumns}
			onHeaderClick={jest.fn()}
			onFocusChange={mockFocusHandler}
		/>
	)
	const trs = component.find("tr")
	for (let i=1; i<trs.length; i++) {
		const tds = trs.at(i).find("td")
		for (let j=0; j<tds.length; j++) {
			tds.at(j).simulate("click")
			expect(mockFocusHandler).toBeCalledWith(i-1, j)
		}
	}
})
