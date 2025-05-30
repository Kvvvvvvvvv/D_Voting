const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;

  beforeEach(async () => {
    votingInstance = await Voting.new();
  });

  it("should initialize with 3 candidates", async () => {
    const candidatesCount = await votingInstance.candidatesCount();
    assert.equal(candidatesCount, 3, "Should have 3 candidates");
  });

  it("should allow a valid vote", async () => {
    await votingInstance.vote(1, { from: accounts[0] });
    const candidate = await votingInstance.getCandidate(1);
    assert.equal(candidate[2], 1, "Candidate should have 1 vote");
  });

  it("should not allow double voting", async () => {
    await votingInstance.vote(1, { from: accounts[0] });
    try {
      await votingInstance.vote(2, { from: accounts[0] });
      assert.fail("Should not allow double voting");
    } catch (error) {
      assert(error.message.indexOf("You have already voted") >= 0);
    }
  });

  it("should track voter status", async () => {
    const hasVotedBefore = await votingInstance.hasVoted(accounts[0]);
    assert.equal(hasVotedBefore, false, "Should not have voted initially");
    
    await votingInstance.vote(1, { from: accounts[0] });
    
    const hasVotedAfter = await votingInstance.hasVoted(accounts[0]);
    assert.equal(hasVotedAfter, true, "Should have voted after voting");
  });
});