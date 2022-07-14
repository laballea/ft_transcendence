import React from 'react';

import defaultUserImage from '../../../assets/images/default-user.png'


const getProfilImg = (profilPic:string) => {
	let src = profilPic
	if (src === "default")
		src = defaultUserImage
  	return src
}

export default getProfilImg
