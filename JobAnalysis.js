class Job {
    constructor(jobData) {
        this.title = jobData.Title;
        this.posted = jobData.Posted;
        this.type = jobData.Type;
        this.level = jobData.Level;
        this.skill = jobData.Skill;
        this.detail = jobData.Detail;
    }

    getDetails() {
        return `Title: ${this.title}\nType: ${this.type}\nLevel: ${this.level}\nSkill: ${this.skill}\nDetail: ${this.detail}`;
    }

    getFormattedPostedTime() {
        const time = this.posted.match(/(\d+)/);
        const unit = this.posted.match(/(minute|hour|day)/);
        return time && unit ? parseInt(time[0]) : 0;
    }
}

const jobList = [];
const jobContainer = document.getElementById("job-list");
const fileInput = document.getElementById("file-input");
const filterBtn = document.getElementById("filter-btn");
const sortBtn = document.getElementById("sort-btn");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jobs = JSON.parse(e.target.result);
                jobList.length = 0;
                jobs.forEach(jobData => jobList.push(new Job(jobData)));
                populateFilterOptions(jobList);
                displayJobs(jobList);
            } catch (err) {
                alert("Invalid JSON format");
            }
        };
        reader.readAsText(file);
    }
});

function displayJobs(jobs) {
    jobContainer.innerHTML = "";
    if (jobs.length === 0) {
        const noJobsMessage = document.createElement("div");
        noJobsMessage.classList.add("no-jobs-message");
        noJobsMessage.textContent = "No jobs available.";
        jobContainer.appendChild(noJobsMessage);
    } else {
        jobs.forEach(job => {
            const jobItem = document.createElement("div");
            jobItem.classList.add("job-item");
            jobItem.textContent = job.title;
            jobItem.addEventListener("click", () => {
                alert(job.getDetails());
            });
            jobContainer.appendChild(jobItem);
        });
    }
}

function populateFilterOptions(jobs) {
    const skillDropdown = document.getElementById("filter-skill");
    const uniqueSkills = new Set(jobs.map(job => job.skill).filter(skill => skill && skill !== "No Data"));

    skillDropdown.innerHTML = '<option value="All">All</option>';

    if (uniqueSkills.size === 0) {
        const noJobsOption = document.createElement("option");
        noJobsOption.value = "No Jobs";
        noJobsOption.textContent = "No jobs available";
        skillDropdown.appendChild(noJobsOption);
    } else {
        uniqueSkills.forEach(skill => {
            const option = document.createElement("option");
            option.value = skill;
            option.textContent = skill;
            skillDropdown.appendChild(option);
        });
    }
}

filterBtn.addEventListener("click", () => {
    const level = document.getElementById("filter-level").value;
    const type = document.getElementById("filter-type").value;
    const skill = document.getElementById("filter-skill").value;

    const filteredJobs = jobList.filter(job => {
        return (level === "All" || job.level === level) &&
               (type === "All" || job.type === type) &&
               (skill === "All" || job.skill === skill);
    });

    displayJobs(filteredJobs);
});

sortBtn.addEventListener("click", () => {
    const sortBy = document.getElementById("sort-by").value;
    const sortedJobs = [...jobList];

    if (sortBy === "title") {
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "posted") {
        sortedJobs.sort((a, b) => b.getFormattedPostedTime() - a.getFormattedPostedTime());
    }

    displayJobs(sortedJobs);
});

