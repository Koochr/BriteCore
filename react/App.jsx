/* global rowsPerPage */
import React from "react"
import Papa from "papaparse"
import DataTable from "./components/DataTable.jsx"
import Pagination from "./components/Pagination.jsx"

/*
Defining rowsPerPage as global for be able to mock it in tests;
In real-world app all of these should be defined somewhere outside.
*/
global.rowsPerPage = 15
const editableColumns = ["Description",]
const fileURL = "/sheet.csv"

export default class App extends React.Component {
  state = {
  	parsedData: null,
  	sortedData: null,
  	sort: null,
		focusedCell: null,
  	page: 0,
  	status: "idle",
  }

  componentDidMount() {
  	this.setState({ status: "waiting", })
  	try {
  		Papa.parse(fileURL, {
  			download: true,
  			header: true,
  			dynamicTyping: { Amount: true, },
  			complete: data => {
  				this.setState({
  					parsedData: data,
  					sortedData: data.data.map((value, index) => Object.assign({}, value,{ initialIndex: index, })),
  					status: "idle",
  				})
  			},
  			error: () => {
  				this.setState({ status: "error", })
  			},
  		})
  	} catch (err) {
  		this.setState({ status: "error", })
  	}
  }

	handleFocus = (row, column) => {
  	row !== undefined
			? this.setState({
					focusedCell: {
						row,
						column,
					},
				})
			: this.setState({ focusedCell: null})
	}

	toggleSort = column => {
  	const sort = {
  		column,
			ascending: !((this.state.sort?.column === column) && this.state.sort.ascending),
		}
		this.state.sortedData.sort((a, b) => {
			if ((a[sort.column] > b[sort.column]) !== sort.ascending) {
				return -1
			}
			return 1
		})
		this.setState({
			focusedCell: null,
			page: 0,
			sort,
			status: "idle",
		})
	}

	onChangePage = page => {
  	this.setState({
			focusedCell: null,
			page,
			status: "idle",
		})
	}

	onModify = async (value, rowNumber, column) => {
		const initialRowNumber = this.state.sortedData[this.state.page * rowsPerPage + rowNumber].initialIndex
  	this.state.parsedData.data[initialRowNumber][column] = value //eslint-disable-line
  	this.setState({
  		status: "waiting",
			focusedCell: null,
  	})
  	try {
  		let body = Papa.unparse(this.state.parsedData)
  		let res = await fetch (fileURL, { method: "POST", body, })
			if (res.status !== 200) {
				throw new Error ("Update failed!")
			}
			this.state.sortedData[this.state.page * rowsPerPage + rowNumber][column] = value
  		this.setState({
  			status: "success",
  		})
  	} catch (err) {
  		this.setState({ status: "error", })
  	}
	}

	render() {
  	return <React.Fragment>
  		{this.state.status === "error" && <div className="alert alert-danger">Something went wrong!</div>}
  		{this.state.status === "success" && <div className="alert alert-success">Successfully saved!</div>}
			{this.state.status === "waiting" && <div className="alert alert-warning">Wait a little...</div>}
			{this.state.sortedData && <DataTable
				data={rowsPerPage < this.state.sortedData.length
					? this.state.sortedData.slice(this.state.page * rowsPerPage, (this.state.page + 1) * rowsPerPage)
					: this.state.sortedData}
  			columns={this.state.parsedData.meta.fields}
  			editableColumns={editableColumns}
  			onModify={this.onModify}
				onHeaderClick={this.toggleSort}
				onFocusChange={this.handleFocus}
				sort={this.state.sort}
				focusedCell={this.state.focusedCell}
  		/>}
			{(rowsPerPage < this.state.sortedData?.length) && <Pagination
				totalRows={this.state.sortedData.length}
				rowsPerPage={rowsPerPage}
				currentPage={this.state.page}
				onChangePage={this.onChangePage}
			/>}
  	</React.Fragment>
	}
}
