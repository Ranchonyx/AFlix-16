# Specification for the AFlix-16

## Memory Map
| Range     | Content                     |
| --------- | --------------------------- |
| 0000-FE01 | User Program                |
| FE02-FF00 | ISR                         |
| FF01-FFFF | Boostrap Code, Reset Vector |

## Calling convention
* > Caller saves registers, if desired. No cleanup is done
* > Return address is stored in RA, if you overwrite it, have fun

| Pseudoprogram     | State   |
| ----------------- | ------- |
|                   |         |
| push imm/reg arg1 |         |
| push imm/reg arg2 |         |
|                   | Stack   |
| ...               | arg2    |
|                   | arg1    |
| jsr callee        | RA = IP |

| Pseudoprogram     | State       |
| ----------------- | ----------- |
|                   |             |
| callee:           |             |
| pull arg2 -> reg1 | reg1 = arg2 |
| pull arg1 -> reg2 | reg2 = arg1 |
|                   |             |
| ...               |             |
|                   | Stack       |
| push reg result   | result      |
| ret               | IP = RA     |

## Instruction Format
|      | Category | Subinstruction | Operand Lo | Operand Hi |
| ---- | -------- | -------------- | ---------- | ---------- |
| Bits | 000      | 00000          | 0000000    | 0000000    |

```
Category := Bits 000.2
Subinstruction := Bits 300.7
Operand Hi: Bits := 800.15
Operand Lo: Bits := 1600.23
```

* > Instructions are comprised of 24 Bits in total.
* > The first `3 Bits` denote the instruction category.
* > The following `5 Bits` denote the actual instruction in the category-
* > The following `16 Bits` denote the Operand/s.
* > The first `8 Bits` denote the `High Operand`, whereas the last `8 Bits` denote the `Low Operand`.
* > Depending on the compination of both, the `High Operand` & `Low Operand` may be interpreted as a singular `16-Bit address or immediate`.

## Instruction Categories
| Bits | Category                        |
| ---- | ------------------------------- |
| 000  | Load Register with Immediate    |
| 001  | Load Register with Value in RAM |
| 010  | Store Register value in RAM     |
| 011  | ALU operation with Registers    |
| 100  | Stack operations                |
| 101  | Miscellaneous instructions      |
| 110  | Reserved                        |
| 111  | Reserved                        |

## Instruction Matrices
```
Operand bits denoted as `!` instead of `0 | 1` signify the validity of those specific bits in the operands for that specific instruction.

"#/16" := 16-Bit Address in RAM
"$/n" := Immediate Value / n-Bits
"Reg" = {A = 000, B = 001, C = 010, D = 011, RA = 100}

```

### Load immediate Value Instructions
```
LoadRegLow  := "L", Reg, "L"
LoadRegHigh := "L", Reg, "H"
LoadRegFull := "L", Reg, "X"
```

| Mnemonic  | Category | Subinstruction | Operand Hi | Operand Lo | Hex    | name                                 |
| --------- | -------- | -------------- | ---------- | ---------- | ------ | ------------------------------------ |
| LAX $/16  | 000      | 00000          | !!!!!!!!   | !!!!!!!!   | 00!!!! | Load full A Register with immediate  |
| LAH $/8   | 000      | 00001          | 0000000    | !!!!!!!!   | 01!!00 | Load high A Register with immediate  |
| LAL $/8   | 000      | 00010          | !!!!!!!!   | 0000000    | 0200!! | Load low A Register with immediate   |
| LBX $/16  | 000      | 00011          | !!!!!!!!   | !!!!!!!!   | 03!!!! | Load full B Register with immediate  |
| LBH $/8   | 000      | 00100          | 0000000    | !!!!!!!!   | 04!!00 | Load high B Register with immediate  |
| LBL $/8   | 000      | 00101          | !!!!!!!!   | 0000000    | 0500!! | Load low B Register with immediate   |
| LCX $/16  | 000      | 00110          | !!!!!!!!   | !!!!!!!!   | 06!!!! | Load full C Register with immediate  |
| LCH $/8   | 000      | 00111          | 0000000    | !!!!!!!!   | 07!!00 | Load high C Register with immediate  |
| LCL $/8   | 000      | 01000          | !!!!!!!!   | 0000000    | 0800!! | Load low C Register with immediate   |
| LDX $/16  | 000      | 01001          | !!!!!!!!   | !!!!!!!!   | 09!!!! | Load full D Register with immediate  |
| LDH $/8   | 000      | 01010          | 0000000    | !!!!!!!!   | 0a!!00 | Load high D Register with immediate  |
| LDL $/8   | 000      | 01011          | !!!!!!!!   | 0000000    | 0b00!! | Load low D Register with immediate   |
| LRAX $/16 | 000      | 01100          | !!!!!!!!   | !!!!!!!!   | 0c!!!! | Load full RA Register with immediate |
| LRAH $/8  | 000      | 01101          | 0000000    | !!!!!!!!   | 0d!!00 | Load high RA Register with immediate |
| LRAL $/8  | 000      | 01110          | !!!!!!!!   | 0000000    | 0e00!! | Load low RA Register with immediate  |


### Load value from RAM
| Mnemonic  | Category | Subinstruction | Operand Hi | Operand Lo | Hex    | name                           |
| --------- | -------- | -------------- | ---------- | ---------- | ------ | ------------------------------ |
| LAX #/16  | 001      | 00000          | !!!!!!!!   | !!!!!!!!   | 20!!!! | Load full A Register from RAM  |
| LAH #/16  | 001      | 00001          | 0000000    | !!!!!!!!   | 21!!00 | Load high A Register from RAM  |
| LAL #/16  | 001      | 00010          | !!!!!!!!   | 0000000    | 2200!! | Load low A Register from RAM   |
| LBX #/16  | 001      | 00011          | !!!!!!!!   | !!!!!!!!   | 23!!!! | Load full B Register from RAM  |
| LBH #/16  | 001      | 00100          | 0000000    | !!!!!!!!   | 24!!00 | Load high B Register from RAM  |
| LBL #/16  | 001      | 00101          | !!!!!!!!   | 0000000    | 2500!! | Load low B Register from RAM   |
| LCX #/16  | 001      | 00110          | !!!!!!!!   | !!!!!!!!   | 26!!!! | Load full C Register from RAM  |
| LCH #/16  | 001      | 00111          | 0000000    | !!!!!!!!   | 27!!00 | Load high C Register from RAM  |
| LCL #/16  | 001      | 01000          | !!!!!!!!   | 0000000    | 2800!! | Load low C Register from RAM   |
| LDX #/16  | 001      | 01001          | !!!!!!!!   | !!!!!!!!   | 29!!!! | Load full D Register from RAM  |
| LDH #/16  | 001      | 01010          | 0000000    | !!!!!!!!   | 2a!!00 | Load high D Register from RAM  |
| LDL #/16  | 001      | 01011          | !!!!!!!!   | 0000000    | 2b00!! | Load low D Register from RAM   |
| LRAX #/16 | 001      | 01100          | !!!!!!!!   | !!!!!!!!   | 2c!!!! | Load full RA Register from RAM |
| LRAH #/16 | 001      | 01101          | 0000000    | !!!!!!!!   | 2d!!00 | Load high RA Register from RAM |
| LRAL #/16 | 001      | 01110          | !!!!!!!!   | 0000000    | 2e00!! | Load low RA Register from RAM  |

### Store values/registers in RAM
```
StoreRegLow     := "S", Reg, "L"
StoreRegHigh    := "S", Reg, "H"
StoreRegFull    := "S", Reg, "X"
StoreImmLow     := "SI" Reg, "L"
StoreImmHigh    := "SI" Reg, "H"
StoreImmFull    := "SI" Reg, "X"

```

| Mnemonic  | Category | Subinstruction | Operand Hi | Operand Lo | Hex    | name                   |
| --------- | -------- | -------------- | ---------- | ---------- | ------ | ---------------------- |
| SAX #/16  | 002      | 00000          | !!!!!!!!   | !!!!!!!!   | 40!!!! | Store full A Register  |
| SAH #/16  | 002      | 00001          | 0000000    | !!!!!!!!   | 41!!00 | Store high A Register  |
| SAL #/16  | 002      | 00010          | !!!!!!!!   | 0000000    | 4200!! | Store low A Register   |
| SBX #/16  | 002      | 00011          | !!!!!!!!   | !!!!!!!!   | 43!!!! | Store full B Register  |
| SBH #/16  | 002      | 00100          | 0000000    | !!!!!!!!   | 44!!00 | Store high B Register  |
| SBL #/16  | 002      | 00101          | !!!!!!!!   | 0000000    | 4500!! | Store low B Register   |
| SCX #/16  | 002      | 00110          | !!!!!!!!   | !!!!!!!!   | 46!!!! | Store full C Register  |
| SCH #/16  | 002      | 00111          | 0000000    | !!!!!!!!   | 47!!00 | Store high C Register  |
| SCL #/16  | 002      | 01000          | !!!!!!!!   | 0000000    | 4800!! | Store low C Register   |
| SDX #/16  | 002      | 01001          | !!!!!!!!   | !!!!!!!!   | 49!!!! | Store full D Register  |
| SDH #/16  | 002      | 01010          | 0000000    | !!!!!!!!   | 4a!!00 | Store high D Register  |
| SDL #/16  | 002      | 01011          | !!!!!!!!   | 0000000    | 4b00!! | Store low D Register   |
| SRAX #/16 | 002      | 01100          | !!!!!!!!   | !!!!!!!!   | 4c!!!! | Store full RA Register |
| SRAH #/16 | 002      | 01101          | 0000000    | !!!!!!!!   | 4d!!00 | Store high RA Register |
| SRAL #/16 | 002      | 01110          | !!!!!!!!   | 0000000    | 4e00!! | Store low RA Register  |

### ALU operations
```
ACC := Reg A
Perform operation on ACC and mem(OperandHi|OperandLow) storing the result in ACC
```
| Mnemonic | Category | Subinstruction | Operand Hi | Operand Lo | Hex    | Written               |
| -------- | -------- | -------------- | ---------- | ---------- | ------ | --------------------- |
| ADD      | 003      | 00000          | !!!!!!!!   | !!!!!!!!   | 60!!!! | Add ACC + mem(B)      |
| SUB      | 003      | 00001          | !!!!!!!!   | !!!!!!!!   | 61!!!! | Subtract ACC - mem(B) |
| AND      | 003      | 00010          | !!!!!!!!   | !!!!!!!!   | 62!!!! | AND ACC & mem(B)      |
| OR       | 003      | 00011          | !!!!!!!!   | !!!!!!!!   | 63!!!! | OR ACC \| mem(B)      |
| NOT      | 003      | 00100          | !!!!!!!!   | !!!!!!!!   | 640000 | NOT ACC               |
| NOR      | 003      | 00101          | !!!!!!!!   | !!!!!!!!   | 65!!!! | NOR ACC !\| mem(B)    |
| NAND     | 003      | 00110          | !!!!!!!!   | !!!!!!!!   | 66!!!! | NAND ACC !& mem(B)    |
| XOR      | 003      | 00111          | !!!!!!!!   | !!!!!!!!   | 67!!!! | XOR ACC ^ mem(B)      |
| INCA     | 003      | 01000          | !!!!!!!!   | !!!!!!!!   | 680000 | Add ACC + 1           |
| DECA     | 003      | 01001          | !!!!!!!!   | !!!!!!!!   | 690000 | Subtract ACC - 1      |

### Stack Operations

| Mnemonic | Category | Subinstruction | Operand Hi | Operand Lo | Hex    | Written                 |
| -------- | -------- | -------------- | ---------- | ---------- | ------ | ----------------------- |
| SRST     | 004      | 00000          | 0000000    | 0000000    | 800000 | Initialise Stack        |
| PHI $/16 | 004      | 00001          | !!!!!!!!   | !!!!!!!!   | 81!!!! | Push Immediate          |
| PHR Reg  | 004      | 00010          | 00000!!!   | 0000000    | 8200!! | Push Register           |
| PLR Reg  | 004      | 00011          | 0000000    | 0000000    | 830000 | Pull Register           |
| RFI      | 004      | 00100          | 0000000    | 0000000    | 840000 | Return from Interrupt   |
| LDSP $/8 | 004      | 00111          | 0000000    | !!!!!!!!   | 8500!! | Load Stack Pointer      |
| RDSP Reg | 004      | 01000          | 00000!!!   | 0000000    | 86!!00 | Read Stack Pointer      |
| DESP     | 004      | 01001          | 0000000    | 0000000    | 8700!! | Decrement Stack Pointer |

### Miscellaneous operations

| Mnemonic | Category | Subinstruction | Operand Hi | Operand Lo | Hex    | Written                    |
| -------- | -------- | -------------- | ---------- | ---------- | ------ | -------------------------- |
| NOP      | 005      | 11111          | 00000000   | 00000000   | bf0000 | No operation               |
| HLT      | 005      | 11110          | 00000000   | 00000000   | be0000 | Freeze processor           |
| JMP      | 005      | 11101          | !!!!!!!!   | !!!!!!!!   | bd!!!! | Unconditially jump to addr |
| JZ       | 005      | 11100          | !!!!!!!!   | !!!!!!!!   | bc!!!! | Jump to addr if ZF         |
| JNZ      | 005      | 11011          | !!!!!!!!   | !!!!!!!!   | bb!!!! | Jump to addr if NOT ZF     |



