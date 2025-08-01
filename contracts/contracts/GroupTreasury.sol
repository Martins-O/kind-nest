// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GroupTreasury is ReentrancyGuard, Ownable {
    struct Expense {
        uint256 id;
        string description;
        uint256 totalAmount;
        address paidBy;
        address[] participants;
        uint256[] shares;
        bool settled;
        uint256 timestamp;
    }
    
    struct Member {
        address wallet;
        string nickname;
        uint256 totalOwed;    // How much this member owes others
        uint256 totalOwing;   // How much others owe this member
        bool active;
    }

    string public groupName;
    uint256 private nextExpenseId;
    
    mapping(address => Member) public members;
    mapping(uint256 => Expense) public expenses;
    mapping(address => mapping(address => uint256)) public balances; // debtor => creditor => amount
    
    address[] public memberList;
    uint256[] public expenseList;
    
    event MemberAdded(address indexed member, string nickname);
    event ExpenseAdded(uint256 indexed expenseId, address indexed paidBy, uint256 amount);
    event DebtSettled(address indexed debtor, address indexed creditor, uint256 amount);
    event MemberRemoved(address indexed member);

    modifier onlyMember() {
        require(members[msg.sender].active, "Not a group member");
        _;
    }

    modifier validMember(address _member) {
        require(_member != address(0), "Invalid address");
        require(members[_member].active, "Member not active");
        _;
    }

    constructor(string memory _groupName, address _creator, string memory _creatorNickname) Ownable(_creator) {
        groupName = _groupName;
        nextExpenseId = 1;
        _addMember(_creator, _creatorNickname);
    }

    function addMember(address _member, string memory _nickname) external onlyOwner {
        _addMember(_member, _nickname);
    }

    function _addMember(address _member, string memory _nickname) internal {
        require(_member != address(0), "Invalid address");
        require(!members[_member].active, "Member already exists");
        require(bytes(_nickname).length > 0, "Nickname required");
        
        members[_member] = Member({
            wallet: _member,
            nickname: _nickname,
            totalOwed: 0,
            totalOwing: 0,
            active: true
        });
        
        memberList.push(_member);
        emit MemberAdded(_member, _nickname);
    }

    function addExpense(
        string memory _description, 
        uint256 _amount, 
        address[] memory _participants
    ) external onlyMember {
        require(_amount > 0, "Amount must be positive");
        require(_participants.length > 0, "Need participants");
        require(bytes(_description).length > 0, "Description required");
        
        // Validate all participants are active members
        for (uint i = 0; i < _participants.length; i++) {
            require(members[_participants[i]].active, "Invalid participant");
        }
        
        uint256 sharePerPerson = _amount / _participants.length;
        uint256 remainder = _amount % _participants.length;
        
        uint256[] memory shares = new uint256[](_participants.length);
        for (uint i = 0; i < _participants.length; i++) {
            shares[i] = sharePerPerson;
            if (i < remainder) {
                shares[i] += 1;
            }
        }
        
        uint256 expenseId = nextExpenseId++;
        expenses[expenseId] = Expense({
            id: expenseId,
            description: _description,
            totalAmount: _amount,
            paidBy: msg.sender,
            participants: _participants,
            shares: shares,
            settled: false,
            timestamp: block.timestamp
        });
        
        expenseList.push(expenseId);
        
        // Update balances
        for (uint i = 0; i < _participants.length; i++) {
            if (_participants[i] != msg.sender) {
                balances[_participants[i]][msg.sender] += shares[i];
                members[_participants[i]].totalOwed += shares[i];
                members[msg.sender].totalOwing += shares[i];
            }
        }
        
        emit ExpenseAdded(expenseId, msg.sender, _amount);
    }

    function settleDebt(address _creditor) external payable nonReentrant validMember(_creditor) {
        uint256 debt = balances[msg.sender][_creditor];
        require(debt > 0, "No debt to settle");
        require(msg.value >= debt, "Insufficient payment");
        
        // Update balances
        balances[msg.sender][_creditor] = 0;
        members[msg.sender].totalOwed -= debt;
        members[_creditor].totalOwing -= debt;
        
        // Transfer payment to creditor
        (bool success, ) = _creditor.call{value: debt}("");
        require(success, "Payment failed");
        
        // Refund excess payment
        if (msg.value > debt) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - debt}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit DebtSettled(msg.sender, _creditor, debt);
    }

    function getBalance(address _member) external view returns (int256) {
        require(members[_member].active, "Member not found");
        return int256(members[_member].totalOwing) - int256(members[_member].totalOwed);
    }

    function getDebtTo(address _creditor) external view returns (uint256) {
        return balances[msg.sender][_creditor];
    }

    function getExpenses() external view returns (Expense[] memory) {
        Expense[] memory allExpenses = new Expense[](expenseList.length);
        for (uint i = 0; i < expenseList.length; i++) {
            allExpenses[i] = expenses[expenseList[i]];
        }
        return allExpenses;
    }

    function getMembers() external view returns (address[] memory) {
        return memberList;
    }

    function getMemberInfo(address _member) external view returns (Member memory) {
        require(members[_member].active, "Member not found");
        return members[_member];
    }

    function getExpenseCount() external view returns (uint256) {
        return expenseList.length;
    }

    function getMemberCount() external view returns (uint256) {
        return memberList.length;
    }

    // Emergency function to remove inactive members (only owner)
    function removeMember(address _member) external onlyOwner validMember(_member) {
        require(_member != owner(), "Cannot remove owner");
        require(members[_member].totalOwed == 0 && members[_member].totalOwing == 0, "Member has outstanding balances");
        
        members[_member].active = false;
        
        // Remove from member list
        for (uint i = 0; i < memberList.length; i++) {
            if (memberList[i] == _member) {
                memberList[i] = memberList[memberList.length - 1];
                memberList.pop();
                break;
            }
        }
        
        emit MemberRemoved(_member);
    }
}