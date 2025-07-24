import { model, Schema } from 'mongoose';
import { IRule, RuleModel } from './rule.interface';

const ruleSchema = new Schema<IRule, RuleModel>({
     content: {
          type: String,
          required: true,
     },
     type: {
          type: String,
          enum: ['privacy', 'terms', 'about'],
          select: 0,
     },
},
     {
          timestamps: true,
          versionKey: false,
     }
);

export const Rule = model<IRule, RuleModel>('Rule', ruleSchema);
