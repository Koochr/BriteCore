import React from "react"
import PropTypes from "prop-types"

export default class InputForm extends React.Component {
  static propTypes = {
  	initialValue: PropTypes.string,
  	onSubmit: PropTypes.func.isRequired,
  	onCancel: PropTypes.func,
  	submitButtonName: PropTypes.string,
  	cancelButtonName: PropTypes.string,
  }

  state = {
  	value: this.props.initialValue || "",
  }

  handleChange = event => {
  	this.setState({ value: event.target.value, })
  }

  handleSubmit = event => {
  	event.stopPropagation()
  	this.props.onSubmit(this.state.value)
  }

	handleCancel = event => {
		event.stopPropagation()
		this.props.onCancel()
	}

  onKeyPress = event => {
  	if (event.charCode === 13) {
  		event.preventDefault()
  		this.handleSubmit(event)
  	}
  }

  render() {
  	return <React.Fragment>
  		<form className="input-form">
  			<textarea
  				className="input-field form-control"
  				onChange={this.handleChange}
  				value={this.state.value}
  				onKeyPress={this.onKeyPress}
  			/>
  			<button
  				className="btn btn-success"
  				type="button"
  				onClick={this.handleSubmit}
  			>
  				{this.props.submitButtonName || "Submit" }
  			</button>
  			{this.props.onCancel && <button
  				className="btn btn-danger"
  				type="button"
  				onClick={this.handleCancel}>
  				{this.props.cancelButtonName || "Cancel" }
  			</button>}
  		</form>
  	</React.Fragment>
  }
}
