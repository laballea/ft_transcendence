import React from 'react';

// Components
import NavBar from '../../navbar/NavBar';

// Assets
import number_4 from '../../../assets/svg/4.svg';
import number_0 from '../../../assets/svg/0.svg';
import E from '../../../assets/svg/E.svg';
import R from '../../../assets/svg/R.svg';
import O from '../../../assets/svg/O.svg';

function Error_404() {
  return (
    <div className="w-full h-full bg-slate-900">
      <NavBar/>
      <div className='relative top-[80px] sm:top-[112px] w-full h-[calc(100%-80px)] sm:h-[calc(100%-112px)] '>
        <div className='absolute w-full h-full text-slate-200 stroke-white'>
          <div className='absolute flex align-center justify-center w-[100%] h-[100%] flex-col sm:flex-row opacity-50 background-red-500'>
            <img src={number_4} alt="4" className='w-full h-[30%] sm:w-[30%] sm:h-full'/>
            <img src={number_0} alt="4" className='w-full h-[30%] sm:w-[30%] sm:h-full'/>
            <img src={number_4} alt="4" className='w-full h-[30%] sm:w-[30%] sm:h-full'/>
          </div>
          <div className='flex absolute w-full h-full '>
            <img src={E} alt="E" className='w-[20%]'/>
            <img src={R} alt="R" className='w-[20%]'/>
            <img src={R} alt="R" className='w-[20%]'/>
            <img src={O} alt="O" className='w-[20%]'/>
            <img src={R} alt="R" className='w-[20%]'/>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Error_404