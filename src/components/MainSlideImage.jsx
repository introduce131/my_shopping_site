import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MainSlideImage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
  };

  return (
    <div className="carousel">
      <Slider {...settings}>
        <div>
          <img src={process.env.PUBLIC_URL + "/images/image01.jpg"} />
        </div>
        <div>
          <img src={process.env.PUBLIC_URL + "/images/image02.jpg"} />
        </div>
        <div>
          <img src={process.env.PUBLIC_URL + "/images/image03.jpg"} />
        </div>
      </Slider>
    </div>
  );
};

export default MainSlideImage;
