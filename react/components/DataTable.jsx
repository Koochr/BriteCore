import React from "react"
import PropTypes from "prop-types"
import InputForm from "./InputForm.jsx"

export default class DataTable extends React.Component {
  static propTypes = {
  	data: PropTypes.arrayOf(PropTypes.object).isRequired,
  	columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  	editableColumns: PropTypes.arrayOf(PropTypes.string),
  	onModify: PropTypes.func,
  	onHeaderClick: PropTypes.func.isRequired,
		onFocusChange: PropTypes.func.isRequired,
  	sort: PropTypes.object,
		focusedCell: PropTypes.object,
  }

  static defaultProps = {
  	editableColumns: [],
  }

  handleSubmit = (value, rowNumber, column) => {
  	this.props.onModify(value, rowNumber, column)
  }

  renderHeader = columns => columns.map(
  	(column, index) => <th
  		className="table-header-cell"
  		key={index}
  		onClick={() => {this.props.onHeaderClick(column)}}
  	>
  		{column}
  		{this.props.sort?.column === column
      && (this.props.sort.ascending
      	? String.fromCharCode(11015)
      	: String.fromCharCode(11014))}
  	</th>
  )

  renderRow = (row, columns, rowNumber) => {
  	let cells = []
  	for (let column of columns) {
  		cells.push(row[column])
  	}
  	return cells.map((cell, index) =>
  		<td key={index} onClick={() => {this.props.onFocusChange(rowNumber, index)}}>
  			{(
  				this.props.editableColumns.includes(columns[index])
          && this.props.focusedCell?.row === rowNumber
          && this.props.focusedCell?.column === index
  			)
  				? <InputForm
  					initialValue={cell}
  					onSubmit={(value) => {this.handleSubmit(value, rowNumber, columns[index])}}
  					submitButtonName="Save"
  					onCancel={() => {this.props.onFocusChange()}}
  				/>
  				: cell
  			}
  		</td>
  	)
  }

  render () {
  	const { data, columns, } = this.props
  	return <table className="table table-striped table-hover">
  		<thead>
  			<tr>
  				{this.renderHeader(columns)}
  			</tr>
  		</thead>
  		<tbody>
  			{data.map((row, index) => <tr key={index} >{this.renderRow(row, columns, index)}</tr>)}
  		</tbody>
  	</table>
  }
}
