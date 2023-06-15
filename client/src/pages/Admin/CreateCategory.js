import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from 'antd';

function CreateCategory() {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState("")


    //Get All category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category)
                setName("")
            }
        } catch (error) {
            console.log(error)
            toast.error("Someting Went Wrong")
        }
    }


    //Add New Category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/v1/category/create-category", {
                name
            });
            if (data?.success) {
                toast.success(`${name} is created`);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("somthing went wrong in input form");
        }
    };


    useEffect(() => {
        getAllCategory();
    }, []);


    //Update Category
    const handleUpdate = async (e) => {
        e.preventDefault()

        try {
            const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`,
                { name: updatedName }
            );
            if (data?.success) {
                toast.success(`${updatedName} is updated`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("somthing went wrong in input form");
        }
    }

    //Delete Category
    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`);
            if (data?.success) {
                toast.success(data.message);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("somthing went wrong in input form");
        }
    }

    return (
        <Layout title={"Dashboard - Create Category"}>
            <div className="container-fluid m-3 p-3 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 >Manage Category</h3>
                        <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        <div className='w-75'>
                            <table className="table table-striped text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {categories.map((c) => (
                                            <tr key={c._id}>
                                                <td>{c.name}</td>
                                                <td><button className="btn btn-primary ms-2"  onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c); }}>Edit</button>
                                                    <button className="btn btn-danger ms-2"  onClick={() => { handleDelete(c._id); }} > Delete </button>
                                                </td>
                                            </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>

                        <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
                            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                        </Modal>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory


