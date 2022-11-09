import { useState, useEffect } from 'react';
import '../sass/main.scss';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import {Formik} from "formik";
import {toast} from "react-toastify";

const Employee = () => {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState('');
    const [selectedItem, setSelectedItem] = useState({});

    useEffect(() => {
        getEmployee();
    }, [])

    const changeModal = () => {
        setOpen(!open);
    }

    const saveEmployee = (values) => {
        if (selectedItem.id){
            axios.put("https://nimadir.herokuapp.com/api/employee/" + selectedItem.id, values)
                .then((res) => {
                    getEmployee();
                    changeModal();
                    setSelectedItem({});
                })
        } else {
            axios.post("https://nimadir.herokuapp.com/api/employee", values)
                .then((res) => {
                    getEmployee();
                    changeModal();
                    
                })
        }
    }

    const deleteEmployee = (id) => {
        setSelectedIndex(id);
        axios.delete("https://nimadir.herokuapp.com/api/employee/" + selectedIndex)
            .then((res) => {
                getEmployee();
                setSelectedIndex("");
            })
    }

    const editEmployee = (item) => {
        setSelectedItem(item);
        changeModal();
    }

    const getEmployee = () => {
        axios.get("https://nimadir.herokuapp.com/api/employee")
            .then((res) => {
                setEmployees(res.data.object);
            })
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12 my-5">
                        <button type="button" className="btn btn-success d-block ml-auto" onClick={changeModal}>Add</button>
                    </div>
                    {employees.map((item, index) => {
                        return (
                            <div className="col-4 mt-3" key={item.id}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3>{item.firstName + " " + item.lastName}</h3>
                                    </div>
                                    <div className="card-body">
                                        <p>Age: <b>{item.age}</b></p>
                                        <p>Salary: <b>${item.salary}</b></p>
                                        <p>Position: <b>{item.position}</b></p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between align-items-center">
                                        <button type="button" className="btn btn-success" onClick={() => editEmployee(item)}>Edit</button>
                                        <button type="button" className="btn btn-danger" onClick={() => deleteEmployee(item.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Modal isOpen={open} toggle={changeModal}>
                <ModalHeader>
                    <h3>Add Employee</h3>
                </ModalHeader>
                <Formik
                    initialValues={{ firstName: '', lastName: '', age: '', salary: '', position: '' }}
                    onSubmit={(values) => {
                        saveEmployee(values);
                    }}
                >
                    {({
                          values,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                      }) => (
                        <form onSubmit={handleSubmit}>
                            <ModalBody>
                                <input
                                    type="text"
                                    name="firstName"
                                    onChange={handleChange}
                                    value={values.firstName}
                                    className='form-control'
                                    placeholder='Firstname'
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    onChange={handleChange}
                                    value={values.lastName}
                                    className='form-control mt-3'
                                    placeholder='Lastname'
                                />
                                <input
                                    type="number"
                                    name="age"
                                    onChange={handleChange}
                                    value={values.age}
                                    className='form-control mt-3'
                                    placeholder='Age'
                                />
                                <input
                                    type="number"
                                    name="salary"
                                    onChange={handleChange}
                                    value={values.salary}
                                    className='form-control mt-3'
                                    placeholder='Salary'
                                />
                                <select name="position" className='form-control mt-3' value={values.position} onChange={handleChange}>
                                    <option>Choose select</option>
                                    <option value="CEO">CEO</option>
                                    <option value="Product Manager">Product Manager</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Software Engineer">Software Engineer</option>
                                    <option value="Frontend Engineer">Frontend Engineer</option>
                              
                                </select>
                            </ModalBody>
                            <ModalFooter>
                                <button type="submit" disabled={isSubmitting} className='btn btn-success'>Save</button>
                                <button type='button' className='btn btn-secondary' onClick={changeModal}>Cancel</button>
                            </ModalFooter>
                        
                        </form>
                    )}
                </Formik>
            </Modal>
        </>
    );
};

export default Employee;
