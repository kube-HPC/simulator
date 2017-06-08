import { Component } from 'react';
import { chunk } from 'lodash';
import { FlexColumns } from './Flex.react';
import './../../stylesheets/Carousel.scss';

export default class Carousel extends React.Component{
  constructor(){
    super();
    this.state = { position: 0 };
  }

  setPosition = position => {
    this.setState( {position} );
  }

  render() {
    const chunks = chunk(this.props.children, parseInt(this.props.amount));
    return (
      <div id="Carousel">
          <FlexColumns className="carouselSlide">
            {chunks[this.state.position]}
          </FlexColumns>
        <div id="carouselDots">
          {
            chunks.map((c, i) => <i
            className={`${(i === this.state.position) ? 'carouselDot-active' : ''} carouselDot`}
            onClick={() => this.setPosition(i)}
            id={`carouselDot-${i}`}
            key={i}>•</i>)
          }
        </div>
      </div>
    );
  }
}
