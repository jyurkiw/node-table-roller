import { RollPlan } from '../src/interfaces/RollPlan';
import { Table } from '../src/interfaces/Table';

export const roll_plans: RollPlan[] = [
    {
        'name': 'hit_location',
        'version': 1.0,
        'rolls': [
            {'table': 'body_location', 'numRolls': 1}
        ]
    },
    {
        'name': 'side',
        'version': 1.0,
        'rolls': [
            {'table': 'side', 'numRolls': 1}
        ]
    },
    {
        'name': 'relation',
        'version': 1.0,
        'rolls': [
            {'table': 'relation', 'numRolls': 1}
        ]
    },
    {
        'name': 'friends, enemies, and lovers',
        'version': 1.0,
        'rolls': [
            {'table': 'friends, enemies, and lovers', 'numRolls': 1}
        ]
    },
    {
        'name': 'siblings and cousins',
        'version': 1.0,
        'rolls': [
            {'table': 'siblings and cousins', 'numRolls': 1}
        ]
    },
    {
        'name': 'children',
        'version': 1.0,
        'rolls': [
            {'table': 'children', 'numRolls': 1}
        ]
    },
    {
        'name': 'inheritors',
        'version': 1.0,
        'rolls': [
            {'table': 'inheritors', 'numRolls': 1}
        ]
    },
    {
        'name': 'parents',
        'version': 1.0,
        'rolls': [
            {'table': 'parents', 'numRolls': 1}
        ]
    },
    {
        'name': 'grandparents',
        'version': 1.0,
        'rolls': [
            {'table': 'grandparents', 'numRolls': 1}
        ]
    },
    {
        'name': 'complication_injury',
        'version': 1.0,
        'rolls': [
            {'table': 'complication_injury', 'numRolls': 1}
        ]
    }
]

export const table_data: Table[] = [
    {
        'name': 'body_location',
        'version': 1.0,
        'substitutions': true,
        'data': [
            {'value': 'skull', 'weight': 1},
            {'value': 'throat', 'weight': 1},
            {'value': 'voicebox', 'weight': 1},
            {'value': 'neck', 'weight': 1},
            {'value': 'colar', 'weight': 1},
            {'value': 'stomach', 'weight': 1},
            {'value': '{side} eye', 'weight': 2},
            {'value': 'nose', 'weight': 1},
            {'value': 'mouth', 'weight': 1},
            {'value': '{side} ear', 'weight': 2},
            {'value': 'tongue', 'weight': 1},
            {'value': 'scalp', 'weight': 1},
            {'value': '{side} peck', 'weight': 2},
            {'value': 'chest', 'weight': 1},
            {'value': '{side} ribs', 'weight': 2},
            {'value': '{side} shoulder', 'weight': 2},
            {'value': '{side} upper arm', 'weight': 2},
            {'value': '{side} lower arm', 'weight': 2},
            {'value': '{side} hand', 'weight': 2},
            {'value': '{side} fingers', 'weight': 2},
            {'value': '{side} thigh', 'weight': 2},
            {'value': 'mid {side} shin', 'weight': 2},
            {'value': '{side} foot', 'weight': 2},
            {'value': '{side} toes', 'weight': 2},
            {'value': 'above the {side} knee', 'weight': 2}
        ]
    },
    {
        'name': 'side',
        'version': 1.0,
        'data': [
            {'value': 'left', weight: 1},
            {'value': 'right', weight: 1}
        ]
    },
    {
        'name': 'friends, enemies, and lovers',
        'version': 1.0,
        'substitutions': true,
        'reference': {
            'table': 'relation',
            'min': 0,
            'max': 15
        }
    },
    {
        'name': 'siblings and cousins',
        'version': 1.0,
        'reference': {
            'table': 'relation',
            'min': 16,
            'max': 18
        }
    },
    {
        'name': 'inheritors',
        'version': 1.0,
        'substitutions': true,
        'reference': {
            'table': 'relation',
            'min': 7,
            'max': 24
        }
    },
    {
        'name': 'children',
        'version': 1.0,
        'reference': {
            'table': 'relation',
            'min': 19,
            'max': 22
        }
    },
    {
        'name': 'parents',
        'version': 1.0,
        'reference': {
            'table': 'relation',
            'min': 25,
            'max': 28
        }
    },
    {
        'name': 'grandparents',
        'version': 1.0,
        'reference': {
            'table': 'relation',
            'min': 29,
            'max': 34
        }
    },
    {
        'name': 'relation',
        'version': 1.0,
        'substitutions': true,
        'data': [
            {'value': '{ex}enemy', weight: 1},
            {'value': 'jilted-lover', weight: 1},
            {'value': '{ex}romantic rival', weight: 1},
            {'value': '{ex}business rival', weight: 1},
            {'value': '{ex}partner-in-crime', weight: 1},
            {'value': '{ex}confidant', weight: 1},
            {'value': '{ex}co-conspirator', weight: 1},
            {'value': '{ex}ally', weight: 1},
            {'value': '{ex}friend', weight: 1},
            {'value': '{ex}best friend', weight: 1},
            {'value': '{ex}comrade', weight: 1},
            {'value': '{ex}lover', weight: 1},
            {'value': '{ex}partner', weight: 1},
            {'value': '{ex}business partner', weight: 1},
            {'value': '{ex}husband', weight: 1},
            {'value': '{ex}wife', weight: 1},
            {'value': 'brother', weight: 1},
            {'value': 'sister', weight: 1},
            {'value': 'cousin', weight: 1},
            {'value': 'son', weight: 1},
            {'value': 'daughter', weight: 1},
            {'value': 'nephew', weight: 1},
            {'value': 'niece', weight: 1},
            {'value': 'grandson', weight: 1},
            {'value': 'granddaughter', weight: 1},
            {'value': 'father', weight: 1},
            {'value': 'mother', weight: 1},
            {'value': 'uncle', weight: 1},
            {'value': 'aunt', weight: 1},
            {'value': 'grandfather', weight: 1},
            {'value': 'grandmother', weight: 1},
            {'value': 'great grandfather', weight: 1},
            {'value': 'great grandmother', weight: 1},
            {'value': 'great uncle', weight: 1},
            {'value': 'great aunt', weight: 1}
        ]
    },
    {
        'name': 'ex',
        'version': 1.0,
        'data': [
            {'value': '', weight: 3},
            {'value': 'ex-', weight: 1}
        ]
    },
    {
        'name': 'complication_injury',
        'version': 1.0,
        'substitutions': true,
        'data': [
            {'value': 'their {body_location} has {scars}', weight: 1},
            {'value': 'their {body_location} has an open wound', weight: 1},
            {'value': 'their {body_location} {destroyed_term}', weight: 1}
        ]
    },
    {
        'name': 'destroyed_term',
        'version': 1.0,
        'data': [
            {'value': 'was destroyed', weight: 1},
            {'value': 'was cleanly severed', weight: 1},
            {'value': 'has been cut off', weight: 1},
            {'value': 'was torn off', weight: 1},
            {'value': 'has been shreaded', weight: 1},
            {'value': 'was crushed', weight: 1},
            {'value': 'has been amputated', weight: 1}
        ]
    },
    {
        'name': 'scars',
        'version': 1.0,
        'data': [
            {'value': 'claw marks', weight: 1},
            {'value': 'a puncture scar', weight: 1},
            {'value': 'visible pock marks', weight: 1},
            {'value': 'old burns', weight: 1},
            {'value': 'Lichtenberg figures', weight: 1},
            {'value': 'melted skin', weight: 1}
        ]
    }
];