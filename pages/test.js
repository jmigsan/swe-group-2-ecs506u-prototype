import axios from 'axios';

const test = () => {
  const fetchData = async () => {
    const response = await axios.get('http://localhost:3000/api/test');
    console.log(response.data);
  };

  fetchData();

  return <div>test</div>;
};
export default test;
