import logo from './logo.svg';
import './App.css';
import QRCode from "react-qr-code";
import { useEffect, useState } from 'react';
import axios from 'axios';
function App() {
  const [data, setdata] = useState([]);
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log(name, value);
    const temp = [...data];
    temp[index][name] = value;
    setdata(temp);

  }

  const getData = async () => {
    let res = await axios({
      method: 'get',
      url: 'http://localhost:3010/values',
    });
    console.log(res.data, '---', res);
    let temp = res.data.map((item) => {
      return {
        url: `http://localhost:3010/value/${item.key}`,
        value: item.value,
        company: item.key,
        isNew: false,
      }
    }
    )
    setdata(temp);
  }
  useEffect(() => {
    getData()
  }
    , [])

  const addValue = async (item, index) => {
    let res = await axios({
      method: 'put',
      url: `http://localhost:3010/value/${item.company}`,
      data: {
        value: item.value
      }
    });
    console.log(res.data, '---', res
    )
  }

  const updateValue = async (item, index) => {
    let res = await axios({
      method: 'post',
      url: `http://localhost:3010/update/${item.company}`,
      data: {
        value: item.value
      }
    });
    console.log(res.data, '---', res
    )
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "10px",
    }}>
      {data.map((item, index) => {
        return (
          <div style={{
            border: "1px solid #000",
            width: 'fit-content',
            marginTop: "10px",
            padding: "10px",
            minWidth: "380px",
          }}
            key={index}
          >
            <input type="text" placeholder="Enter company name" name='company' onChange={(e) => {
              handleChange(e, index)
            }}
              value={item?.company}
            />
            <br />
            <input type="text" placeholder="URL" name='url' onChange={(e) => {
              handleChange(e, index)
            }}
              value={`http://localhost:3010/value/${item?.company}`}
            disabled
            />
            
            <br />

            <input type="number" placeholder="VALUE" name='value' onChange={(e) => {
              handleChange(e, index)
            }}
              value={item?.value}
            />
            <br />

            <button
              disabled={
                !item?.company || !item?.value
              }
              onClick={() => {
                addValue(item, index)
              }
              }>Generate</button>
            {!item?.isNew && <button
              onClick={() => {
                updateValue(item, index)
              }
              }
              
              >UPDATE</button>}
            <p>{item?.company} , {item?.value} , {item?.url}</p>
            <div>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100px", margin: "10px" }}
                value={item?.url}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
        )
      })}
      <button onClick={() => {
        setdata([...data, {
          url: `http://localhost:3010/value/`,
          value: "",
          company: "",
          isNew: true,
        }])
      }
      } style={{
        margin: "10px"
      }}>Add New
      </button>

    </div>
  );
}

export default App;
