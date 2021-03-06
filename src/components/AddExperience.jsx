import React from "react"

import { Modal, Button, Form, Col, Image } from "react-bootstrap"
import { me } from "../fetch"

class AddExperience extends React.Component {
	state = {
		experience: {
			role: "",
			employmentType: "Choose one",
			company: "",
			area: "",
			currentlyWork: true,
			startDate: "",

			endDate: "",
			updateIndustry: false,
			headline: "",
			description: "",
		},
		formData: null,

		exp: {},
		errMessage: "",
		loading: false,
	
	}
	// myId = async () => {
	// 	let id = await me()
	// 	id = id._id
	// 	this.setState({ id })
	// }
	//It passes false as showMode to parent body. It means dont show Modal.
	handleClose = () => this.props.handleClose(false)

	updateField = (e) => {
		let experience = { ...this.state.experience }
		let currentid = e.currentTarget.id

		if (currentid === "currentlyWork") {
			experience[currentid] = e.currentTarget.checked
		} else if (currentid === "updateIndustry") {
			experience[currentid] = e.currentTarget.checked
		} else if (currentid === "updateHeadline") {
			experience[currentid] = e.currentTarget.checked
		} else {
			experience[currentid] = e.currentTarget.value // e.currentTarget.value is the keystroke
		}

		this.setState({ experience: experience })
	}

	EditFetch = async () => {
		let TOKEN = process.env.REACT_APP_TOKEN
		let response

		try {
			if (this.props.exId) {
				const url = `https://striveschool-api.herokuapp.com/api/profile/${this.props.uid}/experiences/`
				response = await fetch(url + this.props.exId, {
					method: "PUT",
					body: JSON.stringify(this.state.experience),
					headers: new Headers({
						"Content-Type": "application/json",

						Authorization: `Bearer ${TOKEN}`,
					}),
				})
			} else {
				response = await fetch(
					`https://striveschool-api.herokuapp.com/api/profile/${this.props.uid}/experiences`,
					{
						method: "POST",
						body: JSON.stringify(this.state.experience),
						headers: new Headers({
							"Content-Type": "application/json",

							Authorization: `Bearer ${TOKEN}`,

						}),
					}
				)
			}

			if (response.ok) {
				let res= await response.json()
				console.log("res of post",res)
				alert("Experience saved!")
				this.setState({
					experience: {
						role: "",
						company: "",
						area: "",
						startDate: "",
						endDate: "",
						description: "",
					},
					errMessage: "",
					loading: false,
				})
				//this.handleClose()
				return res
			} else {
				console.log("an error occurred")
				let error = await response.json()
				this.setState({
					errMessage: error.message,
					
				})
			}
		} catch (e) {
			console.log(e) // Error
			this.setState({
				errMessage: e.message,
				loading: false,
			})
		}
	}

	

	getFetch = async () => {
		let TOKEN = process.env.REACT_APP_TOKEN

		try {
			//https://striveschool-api.herokuapp.com/api/profile//experiences
			const url = `https://striveschool-api.herokuapp.com/api/profile/${this.props.uid}/experiences/`
			let response = await fetch(url + this.props.exId, {
				method: "GET",
				headers: {

					Authorization: `Bearer ${TOKEN}`,
				},
			})
			if (response.ok) {
				let exp = await response.json()
				console.log("exp:", exp)

				this.setState({
					experience: {
						role: exp.role,
						company: exp.company,
						area: exp.area,
						startDate: exp.startDate,
						endDate: exp.endDate,
						description: exp.description,
					},
				})
			}
		} catch (e) {
			console.log(e)
		}
	}

	handleDelete = async () => {
		let TOKEN = process.env.REACT_APP_TOKEN
		try {
			const url = `https://striveschool-api.herokuapp.com/api/profile/${this.props.uid}/experiences/`
			let response = await fetch(url + this.props.exId, {
				method: "DELETE",
				headers: {

					Authorization: `Bearer ${TOKEN}`,

				},
			})
			if (response.ok) {
				alert("exp deleted succesfully")
				this.handleClose()
			} else {
				alert("Something went wrong!")
			}
		} catch (e) {
			console.log(e)
		}
	}

	handleImageUpload = (event) => {
		console.log("target", event.target)
		const formData = new FormData()
		formData.append("experience", event.target.files[0])
		this.setState({ formData })
	}

	UploadImageFetch = (id) => {
		let TOKEN = process.env.REACT_APP_TOKEN

		fetch(
			`https://striveschool-api.herokuapp.com/api/profile/${this.props.uid}/experiences/` +
			id+
				"/picture",
			{
				method: "POST",
				body: this.state.formData,
				headers: new Headers({
					// "Content-Type": "application/json",
					Authorization: `Bearer ${TOKEN}`,
				}),
			}
		)
			.then((response) => response.json())
			// .then((response) => this.setState({loading:false}))
			// .then((response) => 


			.catch((error) => {
				console.error(error)
			})
			this.handleClose()
			
	}
	submitForm = (e) => {
		e.preventDefault()
		this.setState({ loading: true })
		this.postExp()
		
	}
	postExp=async()=>{ let expId = await this.EditFetch();this.UploadImageFetch(expId._id)}

	componentDidMount = async () => {
		console.log(this.props.exId)
		//this.myId()

		if (this.props.exId) {
			this.getFetch()
		}
	}

	render() {
		const { show } = this.props
		return (
			<>
				<Modal show={show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>
							{this.props.exId ? (
								<p>Edit/Delete Experience</p>
							) : (
								<p>Add New Experience</p>
							)}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.submitForm}>
							<Form.Group>
								<Form.Label>Title*</Form.Label>

								<Form.Control
									id="role"
									type="text"
									value={this.state.experience.role}
									onChange={this.updateField}
									placeholder="Ex: Retail Sales Manager"
									required
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label htmlFor="employmentType">
									Employment Type
								</Form.Label>
								<Form.Control
									as="select"
									name="employmentType"
									id="employmentType"
									value={this.state.experience.employmentType}
									onChange={this.updateField}
								>
									<option>Full-time</option>
									<option>Part-time</option>
									<option>Self- Employed</option>
									<option>Freelance</option>
									<option>Contract</option>
									<option>Internship</option>
									<option>Seasonal</option>
									<option>Apprenticeship</option>
								</Form.Control>
								<Form.Label htmlFor="employmentType">
									Country Spesific Employment Types
								</Form.Label>
							</Form.Group>

							<Form.Group>
								<Form.Label>Change the Image</Form.Label>
								<Form.Control
									id="fileUpload"
									type="file"
									onChange={this.handleImageUpload}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>Company *</Form.Label>
								<Form.Control
									id="company"
									type="text"
									value={this.state.experience.company}
									onChange={this.updateField}
									placeholder="Ex: Strive School"
									required
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>Location</Form.Label>
								<Form.Control
									id="area"
									type="text"
									value={this.state.experience.area}
									onChange={this.updateField}
									placeholder="Ex: İstanbul /Turkey"
									required
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>
									<Form.Check
										type="checkbox"
										id="currentlyWork"
										label="I am currently working in this role"
										checked={this.state.experience.currentlyWork}
										onChange={this.updateField}
									/>
								</Form.Label>
							</Form.Group>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label htmlFor="date">Start Date</Form.Label>
									<Form.Control
										type="date"
										name="startDate"
										id="startDate"
										placeholder="start date"
										value={this.state.experience.startDate}
										
										onChange={this.updateField}
										required
									></Form.Control>
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label htmlFor="date">End Date</Form.Label>
									{this.state.experience.currentlyWork && <p>present</p>}

									{!this.state.experience.currentlyWork && (
										<Form.Control
											type="date"
											name="endDate"
											id="endDate"
											placeholder="end date"
											value={this.state.experience.endDate}
											onChange={this.updateField}
											required
										></Form.Control>
									)}
								</Form.Group>
							</Form.Row>

							<Form.Group>
								<Form.Label>
									<Form.Check
										type="checkbox"
										id="updateIndustry"
										label="Update my industry"
										checked={this.state.experience.updateIndustry}
										onChange={this.updateField}
									/>
								</Form.Label>
							</Form.Group>

							<Form.Group>
								<Form.Label>
									<Form.Check
										type="checkbox"
										id="updateHeadline"
										label="Update my headline"
										checked={this.state.experience.updateHeadline}
										onChange={this.updateField}
									/>
								</Form.Label>
							</Form.Group>

							<Form.Group>
								<Form.Label htmlFor="description">Description</Form.Label>
								<Form.Control
									as="textarea"
									name="description"
									id="description"
									placeholder="description"
									value={this.state.experience.description}
									onChange={this.updateField}
									required
								/>
							</Form.Group>
							<Form.Group className="d-flex px-3">
								{this.props.exId && (
									<Button
										className=" deleteBtn"
										variant="primary"
										onClick={this.handleDelete}
									>
										Delete
									</Button>
								)}
								<Button
									className="saveBtn ml-auto"
									variant="primary"
									type="submit"
								>
									{" "}
									Save
								</Button>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		)
	}
}
export default AddExperience