/* global it, beforeAll, afterAll, expect */
import React from "react"
import { shallow, configure, mount, } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import App from "../react/App.jsx"

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

//Mocking componentDidMount to avoid network requests
let CMDBuffer
let rowsPerPageBuffer

beforeAll(() => {
	CMDBuffer = App.prototype.componentDidMount
	rowsPerPageBuffer = global.rowsPerPage
	App.prototype.componentDidMount = () => {}
	global.rowsPerPage = 2
})

afterAll(() => {
	App.prototype.componentDidMount = CMDBuffer
	global.rowsPerPage = rowsPerPageBuffer
})

it("Should render correctly", () => {
	const component = shallow(<App />)
	expect(component).toMatchSnapshot()
})

it("Should render needed elements", () => {
	const component = shallow(<App />)
	component.setState({
		parsedData: { data: mockData, meta: { fields: mockColumns, }, },
		sortedData: mockData.map((value, index) => Object.assign({}, value,{ initialIndex: index, })),
		status: "idle",
	})
	const DataTable = component.find("DataTable")
	expect(DataTable).toHaveLength(1)
	const Pagination = component.find("Pagination")
	expect(Pagination).toHaveLength(1)
})

it("Should handle page change", () => {
	const component = mount(<App />)
	component.setState({
		parsedData: { data: mockData, meta: { fields: mockColumns, }, },
		sortedData: mockData.map((value, index) => Object.assign({}, value,{ initialIndex: index, })),
		status: "idle",
	})
	component.find(".page-link").at(0).simulate("click")
	expect(component.state().page).toStrictEqual(1)
	let trs = component.find("tr")
	for (let i=1; i<trs.length; i++) {
		const tds = trs.at(i).find("td")
		for (let j=0; j<tds.length; j++) {
			expect(tds.at(j).props().children).toStrictEqual(mockData[i+1][mockColumns[j]])
		}
	}

	component.find(".page-link").at(0).simulate("click")
	expect(component.state().page).toStrictEqual(0)
	trs = component.find("tr")
	for (let i=1; i<trs.length; i++) {
		const tds = trs.at(i).find("td")
		for (let j=0; j<tds.length; j++) {
			expect(tds.at(j).props().children).toStrictEqual(mockData[i-1][mockColumns[j]])
		}
	}
})

const sortMockData = (column, ascending) => {
	mockData.sort((a, b) => {
		if ((a[column] > b[column]) !== ascending) {
			return -1
		}
		return 1
	})
}

it("Should handle sort change", () => {
	const component = mount(<App />)
	component.setState({
		parsedData: { data: mockData, meta: { fields: mockColumns, }, },
		sortedData: mockData.map((value, index) => Object.assign({}, value,{ initialIndex: index, })),
		status: "idle",
	})

	const ths = component.find("th")
	for (let i=0; i<ths.length; i++) {
		ths.at(i).simulate("click")
		sortMockData(mockColumns[i], true)
		let trs = component.find("tr")
		for (let j=1; j<trs.length; j++) {
			let tds = trs.at(j).find("td")
			for (let k=0; k<tds.length; k++) {
				expect(tds.at(k).props().children).toStrictEqual(mockData[j-1][mockColumns[k]])
			}
		}
		ths.at(i).simulate("click")
		sortMockData(mockColumns[i], false)
		trs = component.find("tr")
		for (let j=1; j<trs.length; j++) {
			let tds = trs.at(j).find("td")
			for (let k=0; k<tds.length; k++) {
				expect(tds.at(k).props().children).toStrictEqual(mockData[j-1][mockColumns[k]])
			}
		}
	}
})

it("Should handle cell focus", () => {
	const component = mount(<App />)
	component.setState({
		parsedData: { data: mockData, meta: { fields: mockColumns, }, },
		sortedData: mockData.map((value, index) => Object.assign({}, value,{ initialIndex: index, })),
		status: "idle",
	})

	const trs = component.find("tr")
	for (let i=1; i<trs.length; i++) {
		const tds = trs.at(i).find("td")
		for (let j=0; j<tds.length; j++) {
			tds.at(j).simulate("click")
			expect(component.state().focusedCell).toStrictEqual({ column: j, row: i-1, })
		}
	}
})
