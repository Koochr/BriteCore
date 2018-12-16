import React from "react"
import PropTypes from "prop-types"

const Pagination = props => {
	const firstDisplayedNumber = (props.currentPage * props.rowsPerPage) + 1
	const lastDisplayedNumber = Math.min((props.currentPage + 1) * props.rowsPerPage, props.totalRows)

	return <ul className="pagination">
		{props.currentPage !== 0 && <li
			className="page-item page-link"
			onClick={() => {props.onChangePage(props.currentPage-1)}}
		>
      Previous
		</li>}
		<li className="page-item navbar-brand pagination-text">
			{` Records ${firstDisplayedNumber} - ${lastDisplayedNumber} of ${props.totalRows} `}
		</li>
		{props.currentPage < props.totalRows/props.rowsPerPage - 1 && <li
			className="page-item page-link"
			onClick={() => {props.onChangePage(props.currentPage+1)}}
		>
      Next
		</li>}
	</ul>
}

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	totalRows: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
}

export default Pagination
