// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IScore{
    function updateScore(address _student,string memory _subject,uint _score) external;
}
contract Teacher{
    function setScore(IScore iscore,address _student,string memory _subject,uint _score) external{
        iscore.updateScore(_student, _subject, _score);
    } 
}