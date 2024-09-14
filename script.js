const bookMarksContainer = document.querySelector(".bookmarks")
const categorySuggestionsContainer = document.querySelector(".category-suggestions div");
const categoryButtonsContainer = document.querySelector(".category-buttons div");
const categoryInput = document.querySelector(".category");
const categoryButtons = document.querySelectorAll(".category-buttons div span");
const showAll = document.querySelector(".all");
const editBookmarksContainer = document.querySelector(".edit-bookmarks");


localStorage.removeItem("active-category");

showAll.addEventListener("click", ()=>{
    displayBookMarks();
    const categoryButtons = document.querySelectorAll(".category-buttons div span");
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    localStorage.removeItem("active-category");
})


function saveBookMark(){
    localStorage.removeItem("active-category")
    const title = document.querySelector(".title").value.trim();
    const url = document.querySelector(".url").value.trim();
    const category = document.querySelector(".category").value.trim();

    if(!title || !url || !category){
        alert("Please Fill in all Fields");
        return;
    }
    const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};

    if (!allBookMarks[category]) allBookMarks[category] = [];

    allBookMarks[category].push({title,url});


    localStorage.setItem("bookmarks" ,JSON.stringify(allBookMarks));

    //empty all filed
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
    // to show bookmarks direct after add 
    displayBookMarks();
    // to show category suggestions direct after add
    displayCategoraySuggestions();
    // to show category buttons suggestions direct after add
    displayButtonsSuggestions();


};

function displayBookMarks(){
    bookMarksContainer.innerHTML = "";

    const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    for(const category in allBookMarks){
        bookMarks = allBookMarks[category];

        bookMarks.forEach((bookMark ,index) =>{
            const bookMarketElment = document.createElement("div");
            bookMarketElment.innerHTML = `
            <div class="cat">${category}</div>
            <div class="link"><a href="${bookMark.url}" target="_blank">${bookMark.title}</a></div>
            <button class="edit" onclick= "editBookmarks('${category}' ,'${index}')"><span class="material-symbols-outlined">edit_square</span></button>
            <button class="delete" onclick="deleteBookMark('${category}' ,'${index}')">Delete</button>
            `

            bookMarksContainer.appendChild(bookMarketElment);

        })
        
    }
   

}
function filterBokkmarksByCategory(cat){
    bookMarksContainer.innerHTML = "";

    const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    bookMarks = allBookMarks[cat];

    bookMarks.forEach((bookMark ,index) =>{
        const bookMarketElment = document.createElement("div");
        bookMarketElment.innerHTML = `
        <div class="number">${index+1}</div>
        <div class="link"><a href="${bookMark.url}" target="_blank">${bookMark.title}</a></div>
        <button class="edit" onclick= "editBookmarks('${cat}' ,'${index}')"><span class="material-symbols-outlined">edit_square</span></button>
        <button class="delete" onclick="deleteBookMark('${cat}' ,'${index}')">Delete</button>`

        bookMarksContainer.appendChild(bookMarketElment);

    })
   

}


function displayCategoraySuggestions(){
    const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categories  = Object.keys(allBookMarks);
    categorySuggestionsContainer.innerHTML = ``
    categories.forEach((category) =>{
        const categoryElment = document.createElement("span");
        categoryElment.textContent = category;
        categoryElment.addEventListener("click", ()=>{categoryInput.value = category})
        categorySuggestionsContainer.appendChild(categoryElment);
    })

};
function displayButtonsSuggestions(){
    const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categories  = Object.keys(allBookMarks);
    categoryButtonsContainer.innerHTML = ``
    categories.forEach((category) =>{
        const categoryElment = document.createElement("span");
        categoryElment.textContent = category;
        categoryElment.addEventListener("click", ()=>{
            filterBokkmarksByCategory(category);

            localStorage.setItem("active-category", category);

            const categoryButtons = document.querySelectorAll(".category-buttons div span");
            categoryButtons.forEach((btn)  => btn.classList.remove("active"))
            categoryElment.classList.add("active")
        })

        const activeCategory = localStorage.getItem("active-category");
        if(activeCategory == category) categoryElment.classList.add("active");
        categoryButtonsContainer.appendChild(categoryElment);
        
    })

}



function deleteBookMark(category ,index){
    const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    allBookMarks[category].splice(index, 1);

    if(allBookMarks[category].length == 0 ) delete allBookMarks[category];
    localStorage.setItem("bookmarks", JSON.stringify(allBookMarks));
    
   if (allBookMarks[category] && localStorage.getItem("active-category")){
        filterBokkmarksByCategory(category);
   }else{
       displayBookMarks();
   }
    
    displayCategoraySuggestions();
    displayButtonsSuggestions();

}
function editBookmarks(category ,index){
    editBookmarksContainer.style.display = "block";
    // add  category suggesution 
    const categorySuggestions = document.querySelector(".category-sugges ");
    const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    document.querySelector(".edit-bookmarks .title").value = allBookMarks[category][index].title;
    document.querySelector(".edit-bookmarks .url").value = allBookMarks[category][index].url;
    document.querySelector(".edit-bookmarks .category").value = category;


    const categories  = Object.keys(allBookMarks);
    categorySuggestions.innerHTML = ``;
    categories.forEach((category) =>{
        const categoryElment = document.createElement("span");
        categoryElment.textContent = category;
        categoryElment.addEventListener("click", ()=>{document.querySelector(".edit-bookmarks .category").value = category})
        categorySuggestions.appendChild(categoryElment);
    })
    function saveEditing(category ,index){
        
            const title = document.querySelector(".edit-bookmarks .title").value;
            const url = document.querySelector(".edit-bookmarks .url").value;
            const categoryInput = document.querySelector(".edit-bookmarks .category").value;
            const allBookMarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    

    
            if(category !== categoryInput){
                if(!allBookMarks[categoryInput]) allBookMarks[categoryInput] = [];
                allBookMarks[categoryInput].push({
                    title: title,
                    url: url
                });
    
                if (allBookMarks[category] && allBookMarks[category].length > 0) allBookMarks[category].splice(index, 1);
            }else{
                allBookMarks[category][index].title = title;
                allBookMarks[category][index].url = url;
            }
            if(allBookMarks[category] && allBookMarks[category].length == 0 ) delete allBookMarks[category];
            localStorage.setItem("bookmarks", JSON.stringify(allBookMarks));
           
           
           
            editBookmarksContainer.style.display = "none";
        

                if (allBookMarks[category] && localStorage.getItem("active-category")){
                    filterBokkmarksByCategory(category);
               }else{
                   displayBookMarks();
               }
                
                displayCategoraySuggestions();
                displayButtonsSuggestions();
    }

    document.querySelector(".save-editing").onclick = () => {
       saveEditing(category , index)
    };
    
}   

document.querySelector(".cancle-editing").addEventListener("click" ,()=>{
    editBookmarksContainer.style.display = "none";
   

})


displayBookMarks();
displayCategoraySuggestions();
displayButtonsSuggestions();


