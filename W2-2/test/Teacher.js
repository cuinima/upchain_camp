const { ethers } = require("hardhat");
const { expect } = require("chai");


let score,teacher,not_teacher;
let Owner,Student;
describe("Score", function () {
  async function init() {
    [Owner,Student] = await ethers.getSigners();
    //通过设置getContractFactory指定部署钱包
    const Score = await ethers.getContractFactory("Score",Owner);
    score = await Score.deploy();
    await score.deployed();
    console.log("score:" + score.address);
    const Teacher = await ethers.getContractFactory("Teacher",Owner);
    teacher = await Teacher.deploy();
    await teacher.deployed();
    console.log("teacher:" + teacher.address);
    await score.connect(Owner).setTeacher(teacher.address);
    const NOT_Teacher = await ethers.getContractFactory("Teacher",Owner);
    not_teacher = await NOT_Teacher.deploy();
    await not_teacher.deployed();
    console.log("not_teacher:" + not_teacher.address);

  }

  before(async function () {
    await init();
  });

  // 
  it("init Score Owner", async function () {
    expect(await score.Owner()).to.equal(Owner.address);
  });
  it("init Teacher", async function () {
    expect(await score.teacher_bool(teacher.address)).to.equal(true);
  });
  it("Teacher set 50", async function () {
    let tx = await teacher.connect(Owner).setScore(score.address,Student.address,"语文",50);
    await tx.wait();
    expect(await score.student_score(Student.address,"语文")).to.equal(50);
  });
  it("Teacher set 110", async function () {
    //expect(await teacher.connect(Owner).setScore(score.address, Student.address, "语文", 110,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") })).to.be.revertedWith("Score failed!");
    let teacher_110 = teacher.connect(Owner);
    expect(await teacher_110.setScore(score.address, Student.address, "语文", 110,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") })).to.be.revertedWith("Score failed!");
  }); 

  it("not Teacher set 50", async function () {
    let not_teacher_50 = not_teacher.connect(Owner);
    expect(not_teacher_50.setScore(score.address,Student.address,"语文",50,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") })).to.be.revertedWith("not Teacher!");
  });
  it("Teacher set 112", async function () {
    //expect(await teacher.connect(Owner).setScore(score.address, Student.address, "语文", 110,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") })).to.be.revertedWith("Score failed!");
    let teacher_110 = teacher.connect(Owner);
    expect(teacher_110.setScore(score.address, Student.address, "语文", 112,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") })).to.be.revertedWith("Score failed!");
  }); 



});
