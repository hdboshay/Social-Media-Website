import { Divider, Row } from 'antd';
import BlogGrid from './bloggrid';

function Home(props) {
  return (
    <>
      <div className="site-layout-content">
        <div>
          <Divider orientation="center"><h1>Web API Development Blog</h1></Divider>
          <Row justify="center">
              <center>
              <BlogGrid />
              </center>
          </Row>
        </div>
      </div>
    </>  
  );
}

export default Home;