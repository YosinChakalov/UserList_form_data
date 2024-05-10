import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Checkbox, IconButton } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Input } from "antd";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AOS from "aos";
import "aos/dist/aos.css";
import Switcher from "/src/components/Switcher/Switcher";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.glue,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ITEM_HEIGHT = 45;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const City = ["All Cities", "Dushanbe", "Kulob", "Khujand"];
const status = ["All Status", "Inactive", "Active"];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const API = "http://65.108.148.136:8080/ToDo/";
const API_Img = "http://65.108.148.136:8080/images";
function Todo() {
  const [data, setData] = useState([]);
  let [search, setSearch] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [idx, setIdx] = useState(null);
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  async function get() {
    try {
      let { data } = await axios.get(API + `get-to-dos`);
      setData(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchUser(search) {
    try {
      let { data } = await axios.get(API + `get-to-dos?ToDoName=` + search);
      setData(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function del(id) {
    try {
      let { data } = await axios.delete(API + "delete-to-do?id=" + id);
      get();
    } catch (error) {}
  }

  async function delImg(id) {
    try {
      let { data } = await axios.delete(
        API + "delete-to-do-image?imageId=" + id
      );
      get();
    } catch (error) {}
  }

  async function add(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("name", e.target["name"].value);
    formData.append("description", e.target["desc"].value);
    let files = e.target["images"].files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
    }
    try {
      let { data } = await axios.post(API + "add-to-do", formData);
      get();
      e.target["name"].value = "";
      e.target["desc"].value = "";
    } catch (error) {
      log.error(error);
    }
  }

  async function putUser(id) {
    try {
      let { data } = await axios.put(API + "update-to-do", {
        name: editName,
        description: editDesc,
        id: id,
      });
      get();
    } catch (error) {
      console.log(error);
    }
  }

  async function check(id) {
    try {
      let { data } = await axios.put(`${API}is-completed?id=${id}`);
      get();
    } catch (error) {
      console.log(error);
    }
  }

  async function postImg(e) {
    e.preventDefault();
    let formData = new FormData();
    let files = e.target["addImg"].files;
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    formData.append("ToDoId", idx);
    try {
      let { data } = await axios.post(`${API}add-to-do-images?`, formData);
      get();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    get();
    AOS.init();
  }, []);

  console.log(data);

  return (
    <>
      <div className="w-[90%] m-auto mt-[50px]" data-aos='fade-down'>
        <div className="flex justify-between items-center">
          <h1 className="text-[25px] font-[700]">User List</h1>
          <div className="flex justify-around items-center gap-10">
          <Button onClick={handleOpen} variant="contained"><Add style={{marginRight:10}} /> Add
          </Button>
          <Switcher />
          </div>
        </div>
        <div className="flex justify-between items-center mt-[20px]">
          <div>
            <FormControl sx={{ m: 1, width: 300 }} style={{borderColor: "red"}}>
              <InputLabel id="demo-multiple-name-label" className="dark:text-[#eeeeee]">Status</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Status" />}
                MenuProps={MenuProps}
              >
                {status.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-name-label" className="dark:text-[#eeeeee]">City</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="City" />}
                MenuProps={MenuProps}
              >
                {City.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ width: "300px", height: "58px", }}
            />
            <Button
              variant="contained"
              size="large"
              style={{ height: 58 }}
              onClick={() => searchUser(search)}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="mt-[30px]">
          <TableContainer component={Paper} className="dark:bg-[#07072f] dark:text-[#eeeeee]">
            <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dark:text-[#eeeeee]">
              <TableHead>
                <TableRow>
                  <StyledTableCell><span className="dark:text-[#eeeeee]">Name</span></StyledTableCell>
                  <StyledTableCell align="center"><span className="dark:text-[#eee]">Actions</span></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((el) => (
                  <StyledTableRow data-aos="fade-down" data-aos-duration="1000" key={el.id}>
                    <StyledTableCell component="th" scope="row">
                      <div className="flex gap-3 items-center">
                        <Checkbox
                          onClick={() => check(el.id)}
                          checked={el.isCompleted}
                          color="success"
                        />
                        <div className="flex gap-3 items-center">
                          {el.images.map((el) => {
                            return (
                              <>
                              <img
                                src={`${API_Img}/${el.imageName}`}
                                alt=""
                                className="w-[50px] h-[50px] rounded-[50%]"
                              />
                              <IconButton>
                              <Delete onClick={()=> delImg(el.id)} color="error"/>
                              </IconButton>
                              </>
                            );
                          })}
                          <div className="flex gap-2">
                            <Link to={`/TodoId/${el.id}`}>
                              <h1 className="underline-offset-4 underline text-[#474af5]">
                                {el.name}
                              </h1>
                            </Link>
                            <h1 className="dark:text-[#eeeeee]">{el.description}</h1>
                          </div>
                        </div>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="flex justify-center gap-5 items-center">
                        <IconButton variant="contained" color="error" onClick={() => del(el.id)}>
                          <Delete />
                        </IconButton>
                        <form action="" onSubmit={postImg}>
                          <Input
                            size="medium"
                            type="file"
                            name="addImg"
                            style={{ width: "73%" }}
                          />
                          <Button
                            type="submit"
                            variant="outlined"
                            style={{ marginLeft: 10 }}
                            onClick={() => setIdx(el.id)}
                          >
                            Submit
                          </Button>
                        </form>
                        <IconButton
                          color="primary" 
                          onClick={() => {
                              handleOpen2(),
                              setEditDesc(el.description),
                              setEditName(el.name),
                              setIdx(el.id);
                          }}
                          
                        >
                          <Edit />
                        </IconButton>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add User
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <form action="" onSubmit={add}>
                  <Input style={{height: 45, marginBottom: 15}} type="text" name="name" id="" placeholder="Name..." />
                  <Input style={{height: 45, marginBottom: 15}} type="text" name="desc" id="" placeholder="Description..." />
                  <Input style={{height: 45, marginBottom: 15, paddingTop: 9}} type="file" name="images" />
                  <Button variant="outlined" type="submit" onClick={handleClose}>Add</Button>
                </form>
              </Typography>
            </Box>
          </Modal>
          <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit User
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <Input
                  type="text"
                  name="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{height: 45, marginBottom: 15}}
                />
                <Input
                  type="text"
                  name="description"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  style={{height: 45, marginBottom: 15}}
                />
                <Button
                  type="submit"
                  onClick={() => {
                    setOpen2(false), putUser(idx);
                  }}
                  variant="outlined"
                >
                  Edit
                </Button>
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Todo;
