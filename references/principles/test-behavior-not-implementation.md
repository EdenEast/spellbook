# Test behavior, not implementation

## Rule

Test the contract consumers observe with assertions sensitive to relevant defects.

## When to use

Writing, changing, or reviewing a test, including tests around errors, side
effects, and adapters to external systems.

## How to apply

1. Name the behavior and a plausible defect the test should detect.
2. Call the subject through the appropriate public interface with a concrete
   input. Assert the expected output, state change, or external effect.
3. Keep the expected result independent of the implementation under test.
4. Check defect sensitivity by reasoning through a broken result or temporarily
   introducing a targeted mutation when the risk justifies it.

For example, test that an installer leaves a conflicting file intact and creates
no other links. A successful installation case separately establishes that it
can create the intended links.

## Boundaries

Negative assertions are useful for forbidden effects and error cases. Mock
assertions can verify a boundary contract, such as the exact request payload.
Compile-time tests and consistency checks can enforce structural invariants.
Choose the assertion for the contract; its matcher name does not establish
whether the test is useful. Scale test effort to the change and repository rules.

## Check

What relevant defect would make this test fail? Could required behavior break
while every assertion still passes? Strengthen or remove a test that establishes
no useful contract.

## Related references

- [Prove it works](prove-it-works.md)
- [Fix root causes](fix-root-causes.md)
