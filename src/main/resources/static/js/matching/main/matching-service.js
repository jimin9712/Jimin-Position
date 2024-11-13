const matchingService = (() => {
    const getList = async (page, keyword, type,  callback) =>{
        page = page || 1;
        const response = await fetch(`/corporation/notices/all-list/${page}?keyword=${keyword}&types=${type}`);
        const notices = await response.json();

        if(callback) {
            callback(notices);
        }
    }

    return {getList:getList};
})()