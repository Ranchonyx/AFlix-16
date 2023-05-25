.section bootstrap:
    SRST
.endsection

.section program:
    LAX $00ff ;0
    LBX $0001 ;1
    SBX #$0000 ;2

    NOP ;3
    SUB #$0000 ;4
    JNZ $0003
    HLT
.endsection*