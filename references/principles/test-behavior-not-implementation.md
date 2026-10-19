# Test behavior, not implementation

## Rule

Test the contract consumers observe with assertions that detect relevant defects
and survive behavior-preserving internal refactors.

## When to use

Writing, changing, or reviewing a test, including tests around errors, side
effects, and adapters to external systems.

## How to apply

1. Name the behavior consumers can observe and a plausible defect the test
   should detect. Behavior includes return values, errors, readable state, and
   effects received by external systems. Private helpers, internal call order,
   and intermediate data are implementation unless they are the contract.
2. Call the subject in the test body through the interface its users use, with
   a concrete input. Assert a literal expected output, state change, or external
   effect where possible.
3. Derive the expected result from the requirement, independently of the
   implementation under test. Assert what the contract promises, no less and
   no more.
4. Check for weak or absent assertions, mock-call or absence-only assertions,
   self-referential expected values, pins of hand-maintained constants or prompt
   strings, and fixtures that only assert their own setup. Examples include
   only checking `toBeTruthy` or `not.toThrow`, only checking that a mock was
   called, comparing `f(a)` with itself, or asserting a constant without running
   the behavior that consumes it.
5. Ask whether the test would still pass if the subject and its imported
   functions returned `undefined` or did no work. Use this as a quick diagnostic,
   then check sensitivity to a relevant defect. Reason through a broken result
   or use a targeted mutation when the risk justifies it.
6. Imagine changing private helpers, internal call order, or internal
   collaborators while preserving every observable result. The test should
   keep passing. If it would fail, move the assertion to the observable contract
   unless the internal structure is itself the invariant being checked.
7. For absence, also establish presence on a contrasting input. For constants,
   exercise the mechanism that uses them. For mocks, assert the payload or the
   resulting state. Strengthen or delete tests that establish no useful contract.

For example, test that an installer leaves a conflicting file intact and creates
no other links. A successful installation case separately establishes that it
can create the intended links.

## Boundaries

Negative assertions are useful for forbidden effects and error cases. Mock
assertions can verify a boundary contract, such as the exact request payload.
Compile-time tests and consistency checks can enforce structural invariants.
Assert error types or messages when consumers depend on them, not incidental
wording. An internal helper call is usually implementation; the payload an
external service receives is observable behavior.
Choose the assertion for the contract; its matcher name does not establish
whether the test is useful. Scale test effort to the change and repository rules.

## Check

What relevant defect would make this test fail? Could required behavior break
while every assertion still passes? Would the test survive a behavior-preserving
internal refactor? Strengthen or remove a test that establishes no useful contract.

## Related references

- [Prove it works](prove-it-works.md)
- [Fix root causes](fix-root-causes.md)
