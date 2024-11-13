const matchingService = (() => {
    const getList = async (page, formData,  callback) =>{
        page = page || 1;
        const response = await fetch(`/corporation/notices/all-list/${page}`, {
            method: "post",
            body: formData
        });
        const notices = await response.json();

        if(callback) {
            callback(notices);
        }
    }

    return {getList:getList};
})()