// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract Score{
    address public Owner;
    mapping(address=>bool) public  teacher_bool;
    //一般不实用string 使用enum代替
    mapping(address=>mapping(string=>uint)) public student_score;

    constructor(){
        Owner = msg.sender;
    }
    modifier OnlyOwner{
        require(msg.sender == Owner,"not Owner!");
        _;
    }
    modifier OnlyTeacher{
        require(teacher_bool[msg.sender],"not Teacher!");
        _;
    }
    modifier CheckScore(uint _score){
        require(_score <= 100,"Score failed!");
        _;
    }
    //设置学生 科目 分数
    function updateScore(address _student,string memory _subject,uint _score) external OnlyTeacher CheckScore(_score) {
        student_score[_student][_subject] = _score;
    }
    //设置老师
    function setTeacher(address _teacher) external OnlyOwner{
        teacher_bool[_teacher] = true;
    }
    
}
