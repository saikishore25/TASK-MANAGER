const getInitials = (username) =>{

    if(!username){

        return ""

    }

    const words =  username.trim().split(" ");
    let initials = "";

    for(let i=0; i<words.length; i++){

        initials += words[i][0];

    }

    return initials.toUpperCase();


}

export default getInitials;