import Image from 'next/image';
import './../styles/card.scss';

export function Card() {
    return (
 <div className="article-card">
    <div className="content">
      <p className="date">Jan 1, 2022</p>
      <p className="title">Article Title Goes Here</p>
    </div>
   
  </div>
    );
}